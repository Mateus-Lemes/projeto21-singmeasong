import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { faker } from "@faker-js/faker";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { prisma } from "../../src/database.js";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
})

describe("downVote", () => {
    it("downvote added successfully", async () => {
        const data = {
            id: faker.datatype.number(),
            name: faker.music.songName(),
            youtubeLink: `youtube.com/${faker.random.alphaNumeric(5)}`,
            score: faker.datatype.number({min: -4})
        };
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {
            return data;
        });
        jest.spyOn(recommendationService, "getById").mockImplementationOnce(():any => {
            return data;
        });
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any => {
            return {};
        });

        await recommendationService.downvote(data.id);

        expect(recommendationRepository.updateScore).toBeCalled();
    });

    it("downvote added with score -5", async () => {
        const data = {
            id: faker.datatype.number(),
            name: faker.music.songName(),
            youtubeLink: `youtube.com/${faker.random.alphaNumeric(5)}`,
            score: (-1)*faker.datatype.number({min: 6})
        };
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {
            return data;
        });
        jest.spyOn(recommendationService, "getById").mockImplementationOnce(():any => {
            return data;
        });
        jest.spyOn(recommendationRepository, "updateScore").mockImplementationOnce(():any => {
            return data;
        });
        jest.spyOn(recommendationRepository, "remove").mockImplementationOnce(():any => {
            return "";
        });

        await recommendationService.downvote(data.id);

        expect(recommendationRepository.updateScore).toBeCalled();
        expect(recommendationRepository.remove).toBeCalled()
    });
})