import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { faker } from "@faker-js/faker";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { prisma } from "../../src/database.js";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
})

describe("Get Recommendations", () => {
    it("Get the last 10 Recommendations", async () => {
        const data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                id: faker.datatype.number(),
                name: faker.music.songName(),
                youtubeLink: `youtube.com/${faker.random.alphaNumeric(5)}`,
                score: faker.datatype.number()
            });
        }
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(():any => {
            return data;
        });
        await recommendationService.get();
        expect(recommendationRepository.findAll).toBeCalled();
    })
})