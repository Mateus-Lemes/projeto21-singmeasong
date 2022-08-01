import app from "../../src/app.js";
import supertest from "supertest";
import { prisma } from "../../src/database.js"
import bodyNewRecomendation from "../Factories/newRecommendationFactories.js";
import { createRecommendation } from "../Utils/createRecommendation.js";

beforeEach(async ()=> {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
})

describe("Down Vote (/recommendation/:id/downvote)", ()=> {
    it("downvote added successfully", async () => {
        const newRecomendation = bodyNewRecomendation()
        await supertest(app).post("/recommendations").send(newRecomendation);
        const recomendationExist = await prisma.recommendation.findFirst({
            where: {
                name: newRecomendation.name
            }
        });
        const response = await supertest(app).post(`/recommendations/${recomendationExist.id}/downvote`);
        const status = response.status;

        expect(status).toEqual(200);
    });

    it("vote entered in the bank", async ()=> {
        const createdRecommendation:any = await createRecommendation();
        await supertest(app).post(`/recommendations/${createdRecommendation.id}/downvote`);
        const afterUpdate = await prisma.recommendation.findFirst({
            where: {
                id: createdRecommendation.id
            }
        });
        expect(createdRecommendation.score - 1).toEqual(afterUpdate.score);
    })
});

afterAll(async ()=> {
    await prisma.$disconnect()
});