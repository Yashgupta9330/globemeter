import { Request, Response } from "express";
import AdminService from "../services/admin";


export default class AdminController {
  constructor(private adminService: AdminService) {}

  public async handleAddInfo(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const multipleInfo = req.query.multipleInfo;

      if (multipleInfo) {
        if (!Array.isArray(data)) {
          return res.status(400).json({ 
            success: false, 
            message: "Expected array of info objects" 
          });
        }
        const response = await this.adminService.addMultipleInfo(data);
        return res.status(response.code).json({
          success: response.status === "success",
          message: response.message,
          results: response.data
        });
      } else {
        if (
          !data.country ||
          !data.city ||
          !data.clues ||
          !data.fun_fact ||
          !data.trivia
        ) {
          return res.status(400).json({ 
            success: false, 
            message: "Missing required fields" 
          });
        }

        const response = await this.adminService.addInfo(data);
        return res.status(response.code).json({
          success: response.status === "success",
          message: response.message,
          data: response.data
        });
      }
    } catch (error: any) {
      console.error("Error in handleAddInfo controller:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "An error occurred while processing the request"
      });
    }
  }
}