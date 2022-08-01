import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { faker } from "@faker-js/faker";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { prisma } from "../../src/database.js";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
})

describe("Get Recommendations Top X", () => {
    it("", async () => {
        const data = [];
        const amount = 3
        for (let i = 0; i < 5; i++) {
            data.push({
                id: faker.datatype.number(),
                name: faker.music.songName(),
                youtubeLink: `youtube.com/${faker.random.alphaNumeric(5)}`,
                score: 500 - i
            });
        };
        const dataMock = [];
        for (let i = 0; i < amount; i++) {
            dataMock.push({
                id: data[i].id,
                name: data[i].name,
                youtubeLink: data[i].youtubeLink,
                score: data[i].score
            });
        };
        jest.spyOn(recommendationRepository, "getAmountByScore").mockImplementationOnce(():any => {
            return dataMock;
        })
        const response = await recommendationService.getTop(amount);
        expect(response).toEqual(dataMock);
    })
})