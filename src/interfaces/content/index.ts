import { CommentInterface } from 'interfaces/comment';
import { UserInterface } from 'interfaces/user';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface ContentInterface {
  id?: string;
  title: string;
  body: string;
  user_id?: string;
  organization_id?: string;
  created_at?: any;
  updated_at?: any;
  comment?: CommentInterface[];
  user?: UserInterface;
  organization?: OrganizationInterface;
  _count?: {
    comment?: number;
  };
}

export interface ContentGetQueryInterface extends GetQueryInterface {
  id?: string;
  title?: string;
  body?: string;
  user_id?: string;
  organization_id?: string;
}
