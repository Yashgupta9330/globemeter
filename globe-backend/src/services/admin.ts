import { InfoData, InfoResult, StatusResponse } from "../interfaces/admin";
import AdminModel from "../models/admin";

export default class AdminService {
  constructor(private adminModel: AdminModel) {}

  public async addInfo(data: InfoData): Promise<StatusResponse> {
    try {
      const result = await this.adminModel.addInfo(data);
      
      if (!result) {
        return {
          status: "error",
          message: "Failed to add info (city might already exist)",
          code: 400
        };
      }
      
      return {
        status: "success",
        message: "Data added successfully",
        code: 201,
        data: result
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

  public async addMultipleInfo(dataArray: InfoData[]): Promise<StatusResponse> {
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
          const result = await this.adminModel.addInfo(info);
          if (result) {
            results.success.push(result);
          } else {
            results.failures.push({
              data: info,
              error: "Failed to add info (city might already exist)"
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
}