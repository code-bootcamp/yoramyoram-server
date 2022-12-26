import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create({
    name,
    email,
    phone,
    hashedPassword: password,
    address,
    add_detail,
    birth,
  }) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (user) throw new ConflictException('이미 등록된 이메일입니다!');

    return this.userRepository.save({
      name,
      email,
      phone,
      password,
      address,
      add_detail,
      birth,
    });
  }
}
