import { UserInterface } from 'interfaces/user';
import { ContentInterface } from 'interfaces/content';
import { GetQueryInterface } from 'interfaces';

export interface CommentInterface {
  id?: string;
  body: string;
  user_id?: string;
  content_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  content?: ContentInterface;
  _count?: {};
}

export interface CommentGetQueryInterface extends GetQueryInterface {
  id?: string;
  body?: string;
  user_id?: string;
  content_id?: string;
}
