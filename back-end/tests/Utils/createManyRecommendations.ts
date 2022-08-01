import { prisma } from "../../src/database";
import { faker } from "@faker-js/faker";

export async function createManyRecommendations() {
    const data = [];
    for (let i = 0; i < 10; i++) {
        data.push({
            id: i + 1,
            name: faker.random.words(4), // faker.music.nameSong() estava repetindo palavras dando erro nos testes.
            youtubeLink: `youtube.com/${faker.random.alphaNumeric(5)}`,
            score: faker.datatype.number()
        });
    }
    data.sort((a, b) => {
        if (a.id > b.id) {
            return -1;
        }
        return 0
    })

    await prisma.recommendation.createMany({data: data});
    return data
}