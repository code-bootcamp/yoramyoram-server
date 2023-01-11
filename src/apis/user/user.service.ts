import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { IUsersServiceFindOne } from './interfaces/users-service.interface';
import { Comment } from '../comments/entities/comment.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>, //

    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async create({ createUserInput }) {
    const { name, email, phone, password, address, add_detail, role } =
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
      role,
    });
  }

  async findOneEmail({ name, phone }) {
    console.log(name, phone);
    const userId = await this.userRepository.findOne({
      where: { phone },
    });

    console.log(userId);

    if (userId.phone !== phone || userId.name !== name) {
      return '가입한 정보와 다릅니다 ';
    }

    return userId.email;
  }

  async delete({ userId }) {
    await this.commentRepository.delete({ user: userId });

    const result = await this.userRepository.delete({ id: userId });
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

  findLogin({ context }) {
    const user = this.userRepository.findOne({
      where: {
        id: context.req.user.id,
      },
    });

    return user;
  }


  findPoint({ userId }) {
    const user = this.userRepository.findOne({
      where: {
        point: userId.point,
      },
    });
    return user;
  }
  updateUser({ context, updateUserInput }) {
    const result = this.userRepository.save({
      id: context.req.user.id,
      ...updateUserInput,
    });
    return result;

  }
}
