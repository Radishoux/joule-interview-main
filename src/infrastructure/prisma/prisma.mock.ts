import { Mutable } from "../../utils/types";
import { Article } from "../../domain/articles/article.entity";
import { getMax } from "../../utils/objects";
import { User } from "../../domain/users/user.entity";

interface ModelTest<T> {
    data: T[];
    loadData: {
        [key: string]: () => void;
    };
    create?: ({ data }: { data: Mutable<T> }) => T;
    findUnique?: ({ where: { id } }) => T;
}
// autant test toutes les fonctions non ? create, findUnique, update, delete

export interface PrismaServiceTest {
    user: ModelTest<User>;
    article: ModelTest<Article>;
    loadUserData: () => void;
    cleanup: () => void;
}

const generatePersistanceData = <T>(data: T[]) => {
    const incrementedId = (getMax(data, "id") ?? 0) + 1;
    const now = new Date();

    return {
        id: incrementedId,
        createdAt: now,
        updatedAt: now,
    };
};

const UserModel: ModelTest<User> = {
    data: [],
    loadData: {
        common: () => {
            const user: Mutable<User> = {
                email: "user@email.com",
                password: "password",
                followedBy: [],
                following: [],
            };

            UserModel.create({ data: user });
        },
    },
    create: ({ data }) => {
        const user: User = {
            ...data,
            ...generatePersistanceData(UserModel.data),
        };
        UserModel.data.push(user);
        return user;
    },
    findUnique: ({ where: { id } }) => {
        return UserModel.data.filter((user) => user.id === id)[0];
    },
};
// encore une fois, autant tester toutes les fonctions non ? create, findUnique, update, delete

const ArticleModel: ModelTest<Article> = {
    data: [],
    loadData: {
        common: () => {
            const article: Mutable<Article> = {
                authorId: 1,
                title: "A first article",
                description: "Splendid description",
                body: "This is the article body",
                published: true,
            };
            ArticleModel.create({ data: article });
        },
    },
    create: ({ data }) => {
        const article: Article = {
            ...data,
            ...generatePersistanceData(ArticleModel.data),
        };
        ArticleModel.data.push(article);
        return article;
    },
};
// encore une fois, autant tester toutes les fonctions non ? create, findUnique/many, update, delete

export const PrismaTest: PrismaServiceTest = {
    user: UserModel,
    article: ArticleModel,
    loadUserData: UserModel.loadData.common,
    // TODO: Investigate why this is required.It seems Jest does not recreate the PrismaTest object for each new test run, hence not cleaning up the database.
    cleanup: () => {
        UserModel.data = [];
        ArticleModel.data = [];
    },
};

// Je ne maîtrise pas assez Prisma, donc j'aurais du mal à dire, mais après avoir consulté la documentation :
// https://www.prisma.io/docs/orm/prisma-client/testing/unit-testing
// il semble que la réinitialisation doit être effectuée du côté beforeEach et afterEach.

// Il pourrait également être utile de diviser le tout en plusieurs fichiers de tests sectorisés,
// de sorte que la CI/CD puisse effectuer des tests sectorisés par rapport au commit le tout en parallèle.
// (un fichier de test pour les utilisateurs, un fichier de test pour les articles, un fichier de test pour les commentaires, etc...)
