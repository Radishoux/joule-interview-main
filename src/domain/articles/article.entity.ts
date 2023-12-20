import { Mutable } from "../../utils/types";
import { Comment } from "../comments/comment.entity";

export type Article = {
  id: number;
  authorId: number;
  title: string;
  description: string;
  body: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;

  comments?: Comment[];
};

export type MutableArticle = Mutable<Omit<Article, "authorId">>;
