import app from "../../src/app.js";
import supertest from "supertest";
import { prisma } from "../../src/database.js"
import { createManyRecommendations } from "../Utils/createManyRecommendations.js";

beforeEach(async ()=> {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`
})

describe("Get Recommendations (/recommendations)", () => {
    it("Get Recommendations the last 10", async () =>  {
        const recommendations = await createManyRecommendations();
        const insertedRecommendations = await supertest(app).get("/recommendations");

        expect(insertedRecommendations.body).toEqual(recommendations);
    })
})

afterAll(async () => {
    await prisma.$disconnect()
});