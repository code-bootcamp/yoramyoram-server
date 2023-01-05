import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { findBreakingChanges } from 'graphql';
import { IUsersServiceFindOne } from './interfaces/users-service.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({ createUserInput }) {
    const { name, email, phone, password, address, add_detail } =
      createUserInput;
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    const isphone = await this.userRepository.findOne({
      where: { phone: phone },
    });
    if (user) throw new ConflictException('이미 등록된 이메일입니다!');

    // if (isphone) throw new ConflictException('이미 등록된 전화번호 입니다!');

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.userRepository.save({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      add_detail,
    });
  }

  async findOneEmail({ name, phone }) {
    console.log(name, phone);
    const userId = await this.userRepository.findOne({
      where: { phone },
    });

    console.log(userId);

    if (userId.phone !== phone || userId.name !== name) {
      return '가입한 이름과 다릅니다 ';
    }

    return userId.email;
  }

  async delete({ userId }) {
    const result = await this.userRepository.softDelete({ id: userId });

    return result.affected ? true : false;
  }

  async findOne({ email }: IUsersServiceFindOne): Promise<User> {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async findOnePhone({ phone }) {
    return await this.userRepository.findOne({
      where: {
        phone: phone,
      },
    });
  }

  async findOnePassword({ name, email }) {
    return await this.userRepository.findOne({
      where: { name: name, email: email },
    });
  }

  async updatePassword({ password, phone }) {
    // const user = await this.userRepository.findOne({ where: { phone: phone } });

    const hashedpassword = await bcrypt.hash(password, 10);
    try {
      await this.userRepository.update(
        { phone: phone },
        { password: hashedpassword },
      );
      return '비밀번호 재설정이 성공하였습니다';
    } catch (error) {
      throw new ConflictException('비밀번호 재설정이 실패하였습니다');
    }
  }
}
