import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../infrastructure/prisma/prisma.service";
import { Article, MutableArticle } from "./article.entity";
import { validateUserCanMutateArticle } from "./rules";
import { NotificationService } from "../notifications/notifications.service";
import { Mutable } from "../../utils/types";

@Injectable()
export class ArticlesService {
    constructor(
        private prisma: PrismaService,
        private notificationService: NotificationService,
    ) {}

    create = async (article: Mutable<Article>) => {
        const createdArticle = await this.prisma.article.create({
            data: { ...article },
        });
        if (createdArticle.published)
            this.notificationService.notifyPublishedArticle(createdArticle);
    };
    // bon point, le create est async et gagne du temps en ne notifiant que si l'article est publié

    publish = (id: number) => {
      // validateUserCanMutateArticle(persistedArticle, userId); ??
      // verifier si l'utilisateur est bien l'auteur de l'article, qu'il ait le droit de le publier

        this.prisma.article
            .update({
                where: { id },
                data: { published: true },
            })
            .then((article: Article) =>
                this.notificationService.notifyPublishedArticle(article),
            );
    };

    findAll = async (): Promise<Article[]> => {
        return await this.prisma.article.findMany({
            where: { published: true },
        });
    };
    // le findAll await le retour de findmany

    findMine = (authorId: number): Promise<Article[]> => {
        return this.prisma.article.findMany({
            where: { authorId },
        });
    };
    // alors qu'ici pas d'await, on retourne donc la promesse ?

    findDrafts = (authorId: number) => {
        return this.prisma.article.findMany({
            where: { published: false, authorId },
        });
    };

    findOne = (id: number) => {
        return this.prisma.article.findUnique({ where: { id } });
    };

    update = async (
        id: number,
        article: Partial<MutableArticle>,
        userId: number,
    ) => {
        const persistedArticle = await this.prisma.article.findUnique({
            where: { id },
        });
        validateUserCanMutateArticle(persistedArticle, userId);
        return this.prisma.article.update({
            where: { id },
            data: article,
        });
    };

    // comment = async (id: number, comment: string, userId: number) => {
    //     const article = await this.prisma.article.findUnique({ where: { id } });
    //     validateUserCanMutateArticle(article, userId);
    //     return this.prisma.article.update({
    //         where: { id },
    //         data: { comments: [...article.comments, comment] },
    //     });
    // };

    remove = async (id: number, userId: number) => {
        const article = await this.prisma.article.findUnique({ where: { id } });
        validateUserCanMutateArticle(article, userId);
        return this.prisma.article.delete({ where: { id } });
    };
}
