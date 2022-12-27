import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { findBreakingChanges } from 'graphql';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({ createUserInpput }) {
    const { name, email, phone, password, address, add_detail, birth } =
      createUserInpput;
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (user) throw new ConflictException('이미 등록된 이메일입니다!');

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.userRepository.save({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      add_detail,
      birth,
    });
  }

  async findOne(type) {
    const userId = await this.userRepository.findOne({
      where: type,
    });

    if (userId.name !== type.name) return '가입한 이름과 다릅니다 ';

    const findEmail = await this.userRepository.findOne({
      where: type.phone,
    });

    return findEmail.email;
  }
}
