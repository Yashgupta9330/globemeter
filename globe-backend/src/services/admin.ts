import { InfoData, InfoResult, StatusResponse } from "../interfaces/admin";
import prisma from "../db";

export async function addInfo(data: InfoData): Promise<StatusResponse> {
  try {
    // Check if city already exists
    const existingCity = await prisma.city.findFirst({
      where: {
        name: data.city,
        country: {
          name: data.country
        }
      }
    });

    if (existingCity) {
      return {
        status: "error",
        message: "Failed to add info (city might already exist)",
        code: 400
      };
    }

    // Create or find country
    const country = await prisma.country.upsert({
      where: { name: data.country },
      update: {},
      create: { name: data.country }
    });

    // Create city
    const city = await prisma.city.create({
      data: {
        name: data.city,
        countryId: country.id
      }
    });

    // Create info
    const info = await prisma.info.create({
      data: {
        clues: data.clues,
        fun_fact: data.fun_fact,
        trivia: data.trivia,
        cityId: city.id,
      }
    });

    return {
      status: "success",
      message: "Data added successfully",
      code: 201,
      data: info
    };
  } catch (error: any) {
    console.error("Error in addInfo service:", error);
    return {
      status: "error",
      message: error.message || "An error occurred while processing the request",
      code: 500
    };
  }
}

export async function addMultipleInfo(dataArray: InfoData[]): Promise<StatusResponse> {
  try {
    if (!Array.isArray(dataArray)) {
      return {
        status: "error",
        message: "Expected array of info objects",
        code: 400
      };
    }

    const results = {
      success: [] as InfoResult[],
      failures: [] as { data: InfoData; error: string }[]
    };

    // Process all items sequentially
    for (const info of dataArray) {
      if (
        !info.country ||
        !info.city ||
        !info.clues ||
        !info.fun_fact ||
        !info.trivia
      ) {
        results.failures.push({
          data: info,
          error: "Missing required fields"
        });
        continue;
      }

      try {
        const result = await addInfo(info);
        if (result.status === "success" && result.data) {
          results.success.push(result.data);
        } else {
          results.failures.push({
            data: info,
            error: result.message || "Failed to add info"
          });
        }
      } catch (error: any) {
        results.failures.push({
          data: info,
          error: error.message
        });
      }
    }

    return {
      status: "success",
      message: `Successfully added ${results.success.length} items, ${results.failures.length} failures`,
      code: 200,
      data: results
    };
  } catch (error: any) {
    console.error("Error in addMultipleInfo service:", error);
    return {
      status: "error",
      message: error.message || "An error occurred while processing the request",
      code: 500
    };
  }
}