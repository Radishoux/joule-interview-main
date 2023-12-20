import { Article } from "./article.entity";

const canUserMutateArticle = (article: Article, userId: number) => {
    return article.authorId === userId;
};

export const validateUserCanMutateArticle = (
    article: Article,
    userId: number,
) => {
    if (!canUserMutateArticle(article, userId)) {
        throw new Error("User cannot mutate article");
    }
};

// bon point, un throw new Error est toujours mieux qu'un simple return false
