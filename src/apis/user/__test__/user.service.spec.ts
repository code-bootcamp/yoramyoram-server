import { ConflictException } from '@nestjs/common';
import { ExternalExceptionFilterContext } from '@nestjs/core/exceptions/external-exception-filter-context';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { type } from 'os';
import { async } from 'rxjs';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from '../user.service';

class MockUserRepository {
  mydb = [
    {
      name: '철수',
      email: 'a@a.com',
      phone: '01012341234',
      hashedPassword: '1234',
      address: '서울시 구로구 패스트파이브',
      add_detail: '구로 패스트파이브13층',
    },
  ];

  findOne({ email, phone }) {
    const userEmail = this.mydb.filter((el) => el.email === email);
    if (userEmail.length) return userEmail[1];

    const userPhone = this.mydb.filter((el) => el.phone === phone);
    if (userPhone.length) return userPhone[2];
  }

  save({ name, email, phone, hashedPassword, address, add_detail }) {
    this.mydb.push({ name, email, phone, hashedPassword, address, add_detail });
    return { name, email, phone, hashedPassword, address, add_detail };
  }

  update() {}

  delete() {}
}

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: MockRepository<User>;
  beforeEach(async () => {
    const userModule: TestingModule = await Test.createTestingModule({
      providers: [
        //
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
      ],
    }).compile();
    usersService = userModule.get<UsersService>(UsersService);

    userRepository = userModule.get<MockRepository<User>>(
      getRepositoryToken(User),
    );
  });

  describe('create', () => {
    it('이미 존재하는 이메일인지 검증하기', async () => {
      const userRepositoryFindOne = jest.spyOn(userRepository, 'findOne');
      const userRepositorySave = jest.spyOn(userRepository, 'save');
      const createUserInput = {
        name: '경완',
        email: 'a@a.com',
        phone: '01012341234',
        password: '1234',
        address: '서울시 구로구 패스트파이브',
        add_detail: '구로 패스트파이브13층',
      };
      try {
        await usersService.create({ createUserInput });
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }

      expect(userRepositoryFindOne).toBeCalledTimes(1);
      expect(userRepositorySave).toBeCalledTimes(0);
    });
    it('이미 존재하는 전화번호인지 검증하기', async () => {
      const createUserInput = {
        name: '경완',
        email: 'a@a.com',
        phone: '01012341234',
        password: '1234',
        address: '서울시 구로구 패스트파이브',
        add_detail: '구로 패스트파이브13층',
      };
      try {
        await usersService.create({ createUserInput });
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
      }
    });
    it('회원 등록 잘됐는지 검증!!', async () => {
      const userRepositoryFindOne = jest.spyOn(userRepository, 'findOne');
      const userRepositorySave = jest.spyOn(userRepository, 'save');

      const createUserInput = {
        name: '경완',
        email: 'b@b.com',
        phone: '01012341234',
        password: '1234',
        address: '서울시 구로구 패스트파이브',
        add_detail: '구로 패스트파이브13층',
      };

      const myResultDate = {
        name: '경완',
        email: 'b@b.com',
        phone: '01012341234',
        hashedPassword: '1234',
        address: '서울시 구로구 패스트파이브',
        add_detail: '구로 패스트파이브13층',
      };

      const result = await usersService.create({ createUserInput });
      expect(result).toStrictEqual(myResultDate);

      expect(userRepositoryFindOne).toBeCalledTimes(1);
      expect(userRepositorySave).toBeCalledTimes(1);
    });
  });

  describe('findOneEmail', () => {});
});
