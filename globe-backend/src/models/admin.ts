import prisma from "../db";
import { InfoData, InfoResult } from "../interfaces/admin";


export default class AdminModel {
  public async addInfo(data: InfoData): Promise<InfoResult | null> {
    try {
      // Input validation
      const { country, city, clues, fun_fact, trivia } = data;
      
      if (!country || typeof country !== "string" || country.trim() === "") {
        console.error("Invalid country provided");
        return null;
      }
      
      if (!city || typeof city !== "string" || city.trim() === "") {
        console.error("Invalid city provided");
        return null;
      }
      
      if (!Array.isArray(clues) || clues.length === 0) {
        console.error("Invalid clues provided");
        return null;
      }
      
      if (!Array.isArray(fun_fact) || fun_fact.length === 0) {
        console.error("Invalid fun facts provided");
        return null;
      }
      
      if (!Array.isArray(trivia) || trivia.length === 0) {
        console.error("Invalid trivia provided");
        return null;
      }

      // Use Prisma transaction
      return await prisma.$transaction(async (tx) => {
        // Find or create country
        let countryRecord = await tx.country.findUnique({
          where: { name: country }
        });

        if (!countryRecord) {
          countryRecord = await tx.country.create({
            data: { name: country }
          });
        }

        // Check for existing city
        const existingCity = await tx.city.findFirst({
          where: {
            name: city,
            countryId: countryRecord.id
          }
        });

        if (existingCity) {
          console.log(`City ${city} already exists in ${country}`);
          return null;
        }

        // Create new city and info in one operation
        const newCity = await tx.city.create({
          data: {
            name: city,
            country: {
              connect: { id: countryRecord.id }
            },
            info: {
              create: {
                clues,
                fun_fact,
                trivia,
                country: {
                  connect: { id: countryRecord.id }
                }
              }
            }
          },
          include: {
            info: true
          }
        });

        return {
          country: countryRecord,
          city: newCity,
          info: newCity.info!
        };
      });
    } catch (error) {
      console.error("Error in addInfo model:", error);
      return null;
    }
  }
}
