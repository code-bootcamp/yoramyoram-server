import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({ CreateUserInpput }) {
    const { name, email, phone, password, address, add_detail, birth } =
      CreateUserInpput;
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    if (user) throw new ConflictException('이미 등록된 이메일입니다!');

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userRepository.save({
      name,
      email,
      phone,
      password: hashedPassword,
      address,
      add_detail,
      birth,
    });
  }
}
