import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { User } from '../user/entities/user.entity';
import { Comment } from './entities/comment.entity';
import {
  ICommentsServiceCreate,
  ICommentsServiceFindOne,
  ICommentsServiceUpdate,
} from './interfaces/comments-service.interface';

@Injectable()
export class CommentsService {
  //DI
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  //-------------------------*조회*----------------------------//
  findAllMain(): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['user'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findAll({ productId, page }): Promise<Comment[]> {
    const comments = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('productProductId = :productProductId', {
        productProductId: productId,
      })
      .orderBy('createdAt', 'DESC')
      .getMany();

    if (comments.length > 5) {
      const pageNum = Math.ceil(comments.length / 5);
      const result = new Array(pageNum);
      for (let i = 0; i < pageNum; i++) {
        result[i] = comments.slice(i * 5, (i + 1) * 5);
      }
      return result[page - 1];
    }
    return comments;
  }

  async findAllCount({ productId }): Promise<number> {
    // const comments = await this.commentsRepository.find({
    //   where: { product_id: productId },
    //   relations: ['user'],
    // });

    const comments = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('productProductId = :productProductId', {
        productProductId: productId,
      })
      .getMany();

    return comments.length;
  }

  async findOne({ commentId }: ICommentsServiceFindOne): Promise<Comment> {
    const comments = await this.commentsRepository.findOne({
      where: { comment_id: commentId },
      relations: ['user'],
    });

    return comments;
  }

  //-------------------------*생성*----------------------------//
  async create({
    userId,
    createCommentInput,
  }: ICommentsServiceCreate): Promise<Comment> {
    const { productId } = createCommentInput;

    const product = await this.productsRepository.findOne({
      where: { product_id: productId },
    });

    if (!product)
      throw new UnprocessableEntityException('구매한 제품 정보를 입력해주세요');

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user)
      throw new UnprocessableEntityException('구매자 정보를 입력해주세요');

    // 유저 다중으로 안해놓으면 상품이 바뀌어도 유저id로 한번밖에 글 작성을 못함
    const userDuplicate = await this.commentsRepository.findOne({
      where: { user: { id: userId } },
    });

    if (userDuplicate) {
      throw new UnprocessableEntityException(
        user.name +
          '님은 이미 구매평을 작성하셨습니다. 1인당 1개의 구매평만 작성 가능합니다',
      );
    }

    const result = await this.commentsRepository.save({
      ...createCommentInput,
      product: { product_id: productId },
      user: { id: userId },
    });

    await this.productsRepository.save({
      //상품평 작성하면 상품에 상품평count +1
      product_id: productId,
      commentCount: product.commentCount + 1,
    });

    return result;
  }

  //-------------------------*삭제*----------------------------//
  async delete({ commentId }) {
    await this.commentsRepository.save({
      comment_id: commentId,
      isDeleted: true,
    });

    const result = await this.commentsRepository.delete({
      comment_id: commentId,
    });
    return result.affected ? true : false;
  }

  //-------------------------*업데이트*-----------------//
  update({
    comment,
    userId,
    updateCommentInput,
  }: ICommentsServiceUpdate): Promise<Comment> {
    const result = this.commentsRepository.save({
      ...comment,
      userId,
      ...updateCommentInput,
    });

    return result;
  }
}
