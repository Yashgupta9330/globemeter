import { Request, Response } from "express";
import UserService from "../services/user";
import { IuserData } from "../interfaces/user";
import { IuserDataSchema, loginSchema } from "../zod/types";
import jwt from "jsonwebtoken";
import { DecodedToken } from "../middleware/auth";


export default class UserController {
  constructor(private userService: UserService) { }

  public async getUserById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    try {
      const response = await this.userService.getUserById(id);
      if (!response) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async handleCheckUsername(req: any, res: any): Promise<Response> {
    try {
      const username = req.params.username;
      const response = await this.userService.getUserByUsername(username);
      if (!response) {
        return res.status(200).json({ message: "User not found", success: true });
      }
      return res.status(400).json({ success: false });
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: error.message });
    }
  };


  public async handleValidateUser (req: any, res: any) : Promise<Response> {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      console.log("token", token);
      if (!token) {
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET  || "default_secret_key") as DecodedToken
      console.log("decoded", decoded);
      if (!decoded) {
        return res
          .status(401)
          .json({ success: false, error: "Unauthorized" });
      }
      const user = await this.userService.getUserById(decoded.id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, error: "User not found" });
      }
      return res.status(200).json({
        success: true,
        user: {
          id: user.id,
          username: user.username,
          score: user.score,
        },
      });
    } catch (error:any) {
      return res
        .status(500)
        .json({ success: false, error: error.message });
    }
  };


  public async getUserByUsername(req: Request, res: Response): Promise<Response> {
    const { username } = req.params;
    try {
      // Fix: Call getUserByUsername not getUserById
      const response = await this.userService.getUserByUsername(username);
      if (!response) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching user by username:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    const body = req.body;

    try {
      const validatedData = IuserDataSchema.safeParse(body);
      if (!validatedData.success) {
        const errors = validatedData.error.issues.map(issue => issue.message);
        return res.status(400).json({ message: 'Validation error', errors });
      }

      const user: IuserData = validatedData.data;
      const response = await this.userService.createUser(user);

      if (response.status === "error") {
        return res.status(response.code).json({ message: response.message });
      }

      if (!response.token || !response.user) {
        return res.status(500).json({ message: "User created but missing token or user info" });
      }

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res.cookie("token", response.token, options);
      return res.status(response.code).json({
        message: response.message,
        user: response.user,
        token: response.token,
      });

    } catch (error) {
      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }


  public async loginUser(req: Request, res: Response): Promise<Response> {
    const { username, password } = req.body;
    try {
      // Validate request body
      const validatedData = loginSchema.safeParse({ username, password });
      if (!validatedData.success) {
        const errors = validatedData.error.issues[0].message;
        return res.status(400).json({ message: 'Validation error', errors });
      }

      const { username: validatedUsername, password: validatedPassword } = validatedData.data;
      const response = await this.userService.loginUser(validatedUsername, validatedPassword);

      if (response.status === "error") {
        return res.status(response.code).json({ message: response.message });
      }

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      if (response.token) {
        res.cookie("token", response.token, options);
        return res.status(response.code).json({
          message: response.message,
          user: response.user,
          token: response.token
        });
      } else {
        return res.status(500).json({ message: "Token generation failed" });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
