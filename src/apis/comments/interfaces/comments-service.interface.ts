import { CreateCommentInput } from '../dto/create-comment.input';
import { UpdateCommentInput } from '../dto/update-comment.input';
import { Comment } from '../entities/comment.entity';

export interface ICommentsServiceCreate {
  createCommentInput: CreateCommentInput;
}

export interface ICommentsServiceFindOne {
  commentId: string;
}

export interface ICommentsServiceUpdate {
  comment: Comment;
  updateCommentInput: UpdateCommentInput;
  // images: string[]
}
