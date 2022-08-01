import app from "../../src/app.js";
import supertest from "supertest";
import { prisma } from "../../src/database.js"
import { createManyRecommendations } from "../Utils/createManyRecommendations.js";

beforeEach(async ()=> {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
})

describe("Get Recommendations (/recommendations/amount)", () => {
    it("Get Recommendations random", async () =>  {
        await createManyRecommendations();
        const insertedRecommendations = await supertest(app).get(`/recommendations/top/${5}`);

        expect(insertedRecommendations.status).toEqual(200);
    })
})

afterAll(async () => {
    await prisma.$disconnect()
});