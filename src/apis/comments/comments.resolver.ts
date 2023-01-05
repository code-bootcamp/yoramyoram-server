import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query, Context } from '@nestjs/graphql';
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
  @Query(() => [Comment])
  fetchComments(): Promise<Comment[]> {
    return this.commentsService.findAll();
  }

  @Query(() => Comment)
  fetchComment(@Args('commentId') commentId: string): Promise<Comment> {
    return this.commentsService.findOne({ commentId });
  }

  @Query(() => [Comment])
  fetchCommentsWithDeleted(): Promise<Comment[]> {
    return this.commentsService.findAllWithDelete();
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
