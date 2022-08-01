import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { faker } from "@faker-js/faker";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { prisma } from "../../src/database.js";

beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
})


describe("New Recommendation", () => {
    it("Create New Recommendation", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any => {
            return "";
        });
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce(():any => {
            return {};
        });

        const createRecommendationDataFaker = {
            name: faker.music.songName(),
            youtubeLink: `youtube.com/${faker.random.alphaNumeric(5)}`
        }

        await recommendationService.insert(createRecommendationDataFaker);
        expect(recommendationRepository.create).toBeCalled();
    });

    it("Recommendations names isn't unique", async () => {
        const createRecommendationDataFaker = {
            name: faker.music.songName(),
            youtubeLink: `youtube.com/${faker.random.alphaNumeric(5)}`
        }

        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce(():any => {
            return {
                id: faker.datatype.number(),
                name: createRecommendationDataFaker.name,
                youtubeLink: createRecommendationDataFaker.youtubeLink
            };
        });

        const response = recommendationService.insert(createRecommendationDataFaker);

        expect(response).rejects.toEqual({type: "conflict", message: "Recommendations names must be unique"});
    })
});

/* 
async function insert(createRecommendationData: CreateRecommendationData) {
  const existingRecommendation = await recommendationRepository.findByName(
    createRecommendationData.name
  );
  if (existingRecommendation)
    throw conflictError("Recommendations names must be unique");

  await recommendationRepository.create(createRecommendationData);
}
*/