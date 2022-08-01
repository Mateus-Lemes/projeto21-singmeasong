import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { faker } from "@faker-js/faker";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { prisma } from "../../src/database.js";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
})

describe("Get Recommendation Random", () => {
    it("Get Recommendation Random where 'random' is smaller than 0.6", async () => {
        const data = [];
        for (let i = 0; i < 5; i++) {
            data.push({
                id: faker.datatype.number(),
                name: faker.music.songName(),
                youtubeLink: `youtube.com/${faker.random.alphaNumeric(5)}`,
                score: faker.datatype.number({max: 10})
            });
        };
        jest.spyOn(Math, "random").mockImplementationOnce(():any => {
            return 0.6;
        });
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(():any => {
            return data;
        });
        const response = await recommendationService.getRandom();
        expect(response).toHaveProperty("name", response.name);
        expect(response).toHaveProperty("youtubeLink", response.youtubeLink);
    });

    it("Get Recommendation Random where 'random' is bigger than 0.7", async () => {
        const data = [];
        for (let i = 0; i < 5; i++) {
            data.push({
                id: faker.datatype.number(),
                name: faker.music.songName(),
                youtubeLink: `youtube.com/${faker.random.alphaNumeric(5)}`,
                score: faker.datatype.number({min: 11})
            });
        };
        jest.spyOn(Math, "random").mockImplementationOnce(():any => {
            return 0.9;
        });
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(():any => {
            return data;
        });
        const response = await recommendationService.getRandom();
        expect(response).toHaveProperty("name", response.name);
        expect(response).toHaveProperty("youtubeLink", response.youtubeLink);
    });

    it("Not Found Get Recommendation Random", async () => {
        jest.spyOn(Math, "random").mockImplementationOnce(():any => {
            return 0.3;
        });
        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(():any => {
            return [];
        });

        jest.spyOn(recommendationRepository, "findAll").mockImplementationOnce(():any => {
            return [];
        });
        
        const response = recommendationService.getRandom();
        expect(response).rejects.toEqual({type:"not_found", message: ""})
    });
})