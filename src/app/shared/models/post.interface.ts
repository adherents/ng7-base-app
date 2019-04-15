import { IUser } from './user.interface';

export interface IPost {
  id?: string;
  author: string;
  authorId: string;
  content: string;
  image: string;
  published: Date;
  title: string;
}
