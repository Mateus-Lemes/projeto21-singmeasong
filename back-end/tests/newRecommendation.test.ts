import app from "../src/app.js";
import supertest from "supertest";
import { prisma } from "../src/database.js";
import bodyNewRecomendation from "./Factories/newRecommendationFactories.js";

beforeEach(async ()=> {
    await prisma.$executeRaw`DELETE FROM recommendations WHERE name = 'Falamansa - Xote dos Milagres'`
})

describe("New Recommendation", ()=> {
    it("create new recommendation", async ()=> {
        const response = await supertest(app).post("/recommendations").send(bodyNewRecomendation());
        const status = response.status;
        expect(status).toEqual(201);

        const recommendationExist = await prisma.recommendation.findFirst({
            where: {
                name: bodyNewRecomendation().name
            }
        })
        expect(recommendationExist).not.toBeNull()
    })

    it("name isn't a unique string", async ()=> {
        await supertest(app).post("/recommendations").send(bodyNewRecomendation());
        const response = await supertest(app).post("/recommendations").send(bodyNewRecomendation());
        const status = response.status;

        expect(status).toEqual(409);
    })

    it("name isn't a string and youtube link must be a link", async() => {
        const nameNumber = await supertest(app).post("/recommendations").send({
            name: 1,
            youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
        });
        expect(nameNumber.status).toEqual(422);

        const wrongYoutubeLink = await supertest(app).post("/recommendations").send({
            name: "Falamansa - Xote dos Milagres",
            youtubeLink: "https://www.youtue.com/watch?v=chwyjJbcs1Y"
        });
        expect(wrongYoutubeLink.status).toEqual(422);

    })
})

afterAll(async ()=> {
    await prisma.$disconnect()
})