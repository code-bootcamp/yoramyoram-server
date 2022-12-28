import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
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
  // @UseGuards()
  @Mutation(() => Comment)
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ): Promise<Comment> {
    return this.commentsService.create({ createCommentInput });
  }

  //-------------------------*업데이트*----------------------------//
  @Mutation(() => Comment)
  async udpateComment(
    @Args('commentId') commentId: string,
    @Args('updateCommentInput') updateCommentInput: UpdateCommentInput,
  ): Promise<Comment> {
    const comment = await this.commentsService.findOne({ commentId });

    return this.commentsService.update({ comment, updateCommentInput });
  }

  //-------------------------*삭제*----------------------------//
  // @UseGuards()
  @Mutation(() => Boolean)
  async deleteComment(
    @Args('commentId') commentId: string, //
  ) {
    return this.commentsService.delete({ commentId });
  }
}
