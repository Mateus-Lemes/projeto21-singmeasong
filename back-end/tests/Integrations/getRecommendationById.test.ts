import app from "../../src/app.js";
import supertest from "supertest";
import { prisma } from "../../src/database.js";
import { createRecommendation } from "../Utils/createRecommendation.js";

beforeEach(async ()=> {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
});

describe("Get Recommendations By Id", () => {
    it("get recommendation", async () => {
        const recommendation = await createRecommendation();
        const insertedRecommendation = await supertest(app).get(`/recommendations/${recommendation.id}`);

        expect(recommendation).toEqual(insertedRecommendation.body);
        expect(insertedRecommendation.status).toEqual(200);
    });
})

afterAll(async () => {
    await prisma.$disconnect()
});