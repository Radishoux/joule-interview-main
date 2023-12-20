export type Comment = {
  id: number;
  articleId: number;
  authorId: number;
  body: string;
  createdAt: Date;
  updatedAt: Date;
};