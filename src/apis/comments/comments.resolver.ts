import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Context, Int } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/commons/auth/gql-auth.guard';
import { IContext } from 'src/commons/types/context';
import { CommentsService } from './comments.service';
import { CreateCommentInput } from './dto/create-comment.input';
import { UpdateCommentInput } from './dto/update-comment.input';
import { Comment } from './entities/comment.entity';

@Resolver()
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  //-------------------------*조회*----------------------------//
  //메인페이지에서 상품평 보여주는 부분(최신순으로 받아오기, 하나에 대한 상품이 아니므로 페이징처리 필요없음)
  @Query(() => [Comment])
  fetchCommentsMain(): Promise<Comment[]> {
    return this.commentsService.findAllMain();
  }
  //한 상품에 있는 모든 상품평 받아오기
  @Query(() => [Comment])
  fetchComments(
    @Args('productId') productId: string,
    @Args('page') page: number,
  ): Promise<Comment[]> {
    return this.commentsService.findAll({ productId, page });
  }

  //한 상품에 있는 모든 상품평 갯수 받아오기
  @Query(() => Int)
  fetchCommentsCount(@Args('productId') productId: string): Promise<number> {
    return this.commentsService.findAllCount({ productId });
  }

  //한 상품에 있는 상품평 가져와서 수정하고 삭제하기
  @Query(() => Comment)
  fetchComment(@Args('commentId') commentId: string): Promise<Comment> {
    return this.commentsService.findOne({ commentId });
  }

  //-------------------------*생성*----------------------------//
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  createComment(
    @Context() context: IContext,
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ): Promise<Comment> {
    const userId = context.req.user.id;
    return this.commentsService.create({ userId, createCommentInput });
  }

  //
  //-------------------------*업데이트*----------------------------//
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Comment)
  async udpateComment(
    @Args('commentId') commentId: string,
    @Context() context: IContext,
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ): Promise<Comment> {
    const userId = context.req.user.id;
    const comment = await this.commentsService.findOne({ commentId });

    return this.commentsService.update({ comment, userId, updateCommentInput });
  }

  //-------------------------*삭제*----------------------------//
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => Boolean)
  async deleteComment(
    @Args('commentId') commentId: string, //
  ) {
    return this.commentsService.delete({ commentId });
  }
}
