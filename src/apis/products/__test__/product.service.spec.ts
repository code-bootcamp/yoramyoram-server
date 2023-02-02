import {
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductImage } from 'src/apis/productImages/entities/productImage.entity';
import { ProductCart } from 'src/apis/productsCart/entities/productCart.entity';
import { ProductCategory } from 'src/apis/productsCategories/entities/productCategory.entity';
import { ProductWishlist } from 'src/apis/productsWishlists/entities/productWishlist.entity';
import { User } from 'src/apis/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductsService } from '../product.service';

interface IUserfind {
  where: IId;
}
interface IId {
  id: string;
}
interface ICategoryfind {
  where: ICateId;
}
interface ICateId {
  category_id: string;
}

class MockUserRepository {
  users = [
    {
      id: 'A001',
      name: '모니카',
      email: 'mon@gmail.com',
      phone: '01023456789',
      hashedPassword: '1234',
      address: '경기도 성남시 분당구',
      add_detail: '대왕판교로 516',
      role: 'USER',
    },
    {
      id: 'A002',
      name: '레이첼',
      email: 'rach@gmail.com',
      phone: '01022223333',
      hashedPassword: '1234',
      address: '경기도 성남시 분당구',
      add_detail: '대왕판교로 516',
      role: 'ADMIN',
    },
  ];

  findOne(param: IUserfind) {
    const user = this.users.filter((el) => el.id === param?.where.id);
    if (user.length >= 1) return user[0];
    return null;
  }
}

class MockProductCategoryRepository {
  productCategory = [
    {
      category_id: 'C001',
      name: '주방',
    },
    {
      category_id: 'C002',
      name: '생활',
    },
  ];

  findOne(param: ICategoryfind) {
    const cetegory = this.productCategory.filter(
      (el) => el.category_id === param?.where.category_id,
    );
    if (cetegory.length >= 1) return cetegory[0];
    return null;
  }
}

class MockProductRepository {
  products = [
    {
      name: '고무장갑',
      price: 15000,
      description: '찢어지지 않는 고무장갑입니다',
      productImages: ['', '', ''],
      etc1Name: '색상',
      etc1Value: '핑크, 그레이, 블랙',
      etc2Name: '사이즈',
      etc2Value: 's,m,l',
      detailContent: '상세정보',
      productCategoryId: 'C001',
    },
  ];

  save({
    name,
    price,
    description,
    productImages,
    etc1Name,
    etc1Value,
    etc2Name,
    etc2Value,
    detailContent,
    productCategoryId,
  }) {
    this.products.push({
      name,
      price,
      description,
      productImages,
      etc1Name,
      etc1Value,
      etc2Name,
      etc2Value,
      detailContent,
      productCategoryId,
    });
    return {
      name,
      price,
      description,
      productImages,
      etc1Name,
      etc1Value,
      etc2Name,
      etc2Value,
      detailContent,
      productCategoryId,
    };
  }
}

class MockProductImgRepository {
  productImg = [];
  save({ url, isMain, product }) {
    this.productImg.push({ url, isMain, product });
    return { url, isMain, product };
  }
}

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('ProductsService', () => {
  let productsService: ProductsService;
  let productRepository: MockRepository<Product>;

  beforeEach(async () => {
    const productModule: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: MockProductRepository,
        },
        {
          provide: getRepositoryToken(ProductCategory),
          useClass: MockProductCategoryRepository,
        },
        {
          provide: getRepositoryToken(ProductImage),
          useClass: MockProductImgRepository,
        },
        {
          provide: getRepositoryToken(ProductWishlist),
          useValue: {},
        },
        {
          provide: getRepositoryToken(ProductCart),
          useValue: {},
        },
        {
          provide: getRepositoryToken(User),
          useClass: MockUserRepository,
        },
      ],
    }).compile();

    productsService = productModule.get<ProductsService>(ProductsService);
    productRepository = productModule.get<MockRepository<Product>>(
      getRepositoryToken(Product),
    );
  });

  describe('create', () => {
    it('존재하는 유저인지 확인', async () => {
      const createProductInput = {
        name: '인퓨저',
        price: 30000,
        description: '천연 인퓨저입니다',
        productImages: ['', '', ''],
        etc1Name: '색상',
        etc1Value: '브라운, 그린',
        etc2Name: '',
        etc2Value: '',
        detailContent: '상세정보',
        productCategoryId: '',
      };

      const req: any = {
        user: {
          id: 'A004',
        },
      };
      const res: any = {
        send: jest.fn(),
      };
      const context = { req, res };

      try {
        await productsService.create({ createProductInput, context });
      } catch (err) {
        expect(err).toBeInstanceOf(UnprocessableEntityException);
      }
    });

    it('상품등록 권한이 있는지 확인', async () => {
      const createProductInput = {
        name: '인퓨저',
        price: 30000,
        description: '천연 인퓨저입니다',
        productImages: ['', '', ''],
        etc1Name: '색상',
        etc1Value: '브라운, 그린',
        etc2Name: '',
        etc2Value: '',
        detailContent: '상세정보',
        productCategoryId: '',
      };

      const req: any = {
        user: {
          id: 'A001', //일반유저
        },
      };
      const res: any = {
        send: jest.fn(),
      };
      const context = { req, res };

      try {
        await productsService.create({ createProductInput, context });
      } catch (err) {
        expect(err).toBeInstanceOf(ConflictException);
      }
    });

    it('상품카테고리가 함께 등록되었는지 확인', async () => {
      const createProductInput = {
        name: '인퓨저',
        price: 30000,
        description: '천연 인퓨저입니다',
        productImages: ['', '', ''],
        etc1Name: '색상',
        etc1Value: '브라운, 그린',
        etc2Name: '',
        etc2Value: '',
        detailContent: '상세정보',
        productCategoryId: '',
      };

      const req: any = {
        user: {
          id: 'A002', //admin
        },
      };
      const res: any = {
        send: jest.fn(),
      };
      const context = { req, res };

      try {
        await productsService.create({ createProductInput, context });
      } catch (err) {
        expect(err).toBeInstanceOf(UnprocessableEntityException);
      }
    });

    it('상품등록 검증', async () => {
      const createProductInput = {
        name: '인퓨저',
        price: 30000,
        description: '천연 인퓨저입니다',
        productImages: [
          'https://yoram-storage.com/img1.png',
          'https://yoram-storage.com/img2.png',
          'https://yoram-storage.com/img3.png',
        ],
        etc1Name: '색상',
        etc1Value: '브라운, 그린',
        etc2Name: '',
        etc2Value: '',
        detailContent: '상세정보',
        productCategoryId: 'C001',
      };

      const req: any = {
        user: {
          id: 'A002', //admin
        },
      };
      const res: any = {
        send: jest.fn(),
      };
      const context = { req, res };

      const productRegisterd = {
        name: '인퓨저',
        price: 30000,
        description: '천연 인퓨저입니다',
        productImages: [
          'https://yoram-storage.com/img1.png',
          'https://yoram-storage.com/img2.png',
          'https://yoram-storage.com/img3.png',
        ],
        etc1Name: '색상',
        etc1Value: '브라운, 그린',
        etc2Name: '',
        etc2Value: '',
        detailContent: '상세정보',
        productCategoryId: 'C001',
      };

      const result = await productsService.create({
        createProductInput,
        context,
      });
      expect(result.name).toStrictEqual(productRegisterd.name);
      expect(result.etc1Name).toStrictEqual(productRegisterd.etc1Name);
    });
  });
});
