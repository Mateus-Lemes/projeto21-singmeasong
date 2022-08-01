import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { faker } from "@faker-js/faker";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { prisma } from "../../src/database.js";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
})

describe("upVote", () => {
    it("upvote added successfully", async () => {
        const data = {
            id: faker.datatype.number(),
            name: faker.music.songName(),
            youtubeLink: `youtube.com/${faker.random.alphaNumeric(5)}`,
            score: faker.datatype.number()
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

        await recommendationService.upvote(data.id);

        expect(recommendationRepository.updateScore).toBeCalled();
    })

    it("not found recommendation with id", async () => {
        const data = {
            id: faker.datatype.number(),
            name: faker.music.songName(),
            youtubeLink: `youtube.com/${faker.random.alphaNumeric(5)}`,
            score: faker.datatype.number()
        };
        jest.spyOn(recommendationRepository, "find").mockImplementationOnce(():any => {
            return "";
        });
        jest.spyOn(recommendationService, "getById").mockImplementationOnce(():any => {
            return "";
        });

        const response = recommendationService.upvote(data.id);

        expect(response).rejects.toEqual({type:"not_found", message: ""})
    })
})

/*
async function upvote(id: number) {
  await getByIdOrFail(id);

  await recommendationRepository.updateScore(id, "increment");
}

async function getByIdOrFail(id: number) {
  const recommendation = await recommendationRepository.find(id);
  if (!recommendation) throw notFoundError();

  return recommendation;
}
*/