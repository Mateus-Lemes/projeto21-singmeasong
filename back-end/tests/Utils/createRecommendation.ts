import app from "../../src/app.js"
import supertest from "supertest";
import { prisma } from "../../src/database";
import bodyNewRecomendation from "../Factories/newRecommendationFactories";


export async function createRecommendation() {
    const newRecomendation = bodyNewRecomendation()
        await supertest(app).post("/recommendations").send(newRecomendation);
        const recomendationExist = await prisma.recommendation.findFirst({
            where: {
                name: newRecomendation.name
            }
        });
    return recomendationExist
}