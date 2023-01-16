import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from '../user.service';
import { Comment } from 'src/apis/comments/entities/comment.entity';

class MockUserRepository {
  mydb = [
    {
      name: '철수',
      email: 'a@a.com',
      phone: '01023456789',
      hashedPassword: '1234',
      address: '서울시 구로구 패스트파이브',
      add_detail: '구로 패스트파이브13층',
    },
    {
      name: '영희',
      email: 'c@c.com',
      phone: '01012341234',
      hashedPassword: '1234',
      address: '서울시 구로구 패스트파이브',
      add_detail: '구로 패스트파이브13층',
    },
  ];

  findOne(email: any) {
    // console.log(email.where);
    const userEmail = this.mydb.filter((el) => el.email === email.where.email);
    if (userEmail.length >= 1) return userEmail[0];
    return null;
  }

  findOnePhone(phone: any) {
    // console.log(phone.where);
    const userPhone = this.mydb.filter((el) => el.email === phone.where.phone);
    if (userPhone.length >= 1) return userPhone[0];
    return null;
  }

  save({ name, email, phone, hashedPassword, address, add_detail }) {
    this.mydb.push({ name, email, phone, hashedPassword, address, add_detail });
    return { name, email, phone, hashedPassword, address, add_detail };
  }
}

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const userModule: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
        {
          provide: getRepositoryToken(Comment),
          useValue: {},
        },
      ],
    }).compile();

    usersService = userModule.get<UsersService>(UsersService);
    userRepository = userModule.get<MockRepository<User>>(
      getRepositoryToken(User),
    );
  });

  describe('create', () => {
    it('이미 존재하는 이메일인지 검증', async () => {
      const createUserInput = {
        name: '경완',
        email: 'a@a.com',
        phone: '01099998888',
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
    it('이미 존재하는 전화번호인지 검증', async () => {
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

    it('회원 등록 제대로 됐는지 확인', async () => {
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
      expect(result.email).toStrictEqual(myResultDate.email);
      expect(result.phone).toStrictEqual(myResultDate.phone);
    });
  });
});
