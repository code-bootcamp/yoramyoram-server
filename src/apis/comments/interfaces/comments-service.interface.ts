import { Context } from 'vm';
import { CreateCommentInput } from '../dto/create-comment.input';
import { UpdateCommentInput } from '../dto/update-comment.input';
import { Comment } from '../entities/comment.entity';

export interface ICommentsServiceCreate {
  createCommentInput: CreateCommentInput;
  userId: string;
}

export interface ICommentsServiceFindOne {
  commentId: string;
}

export interface ICommentsServiceUpdate {
  comment: Comment;
  userId: string;
  updateCommentInput: UpdateCommentInput;
  // images: string[]
}
