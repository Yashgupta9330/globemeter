import IStatusMap from "../interfaces/statusMap";
import { IuserData } from "../interfaces/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/user";

export default class UserService {
  constructor(private UserModel: UserModel) { }

  async getUserById(id: string): Promise<IuserData | null> {
    const response = await this.UserModel.getUserById(id);
    return response;
  }

  async getUserByUsername(username: string): Promise<IuserData | null> {
    const response = await this.UserModel.getUserByUsername(username);
    return response;
  }

  async createUser(userData: IuserData): Promise<IStatusMap> {
    const response = await this.UserModel.createUser(userData);
    if(response.status === "error") return response;
    const token = jwt.sign(
      { username: response.user.username, id: response.user.id },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "24h" }
    );

    // Don't return the password
    const userWithoutPassword = {
      id: response.user.id,
      username: response.user.username,
      score: response.user.score
    };

    return {
      status: "success",
      message: "User Signup Success",
      code: 200,
      token,
      user: userWithoutPassword,
    };
  }

  async loginUser(username: string, password: string): Promise<IStatusMap> {
    try {
      // Check if user exists
      const user = await this.UserModel.getUserByUsername(username);
      if (!user) {
        return {
          status: "error",
          message: "User not found",
          code: 404,
        };
      }

      // Check if password matches
      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log("passoword ",passwordMatch, user.password, password)
      if (!passwordMatch) {
        return {
          status: "error",
          message: "Password is incorrect",
          code: 401,
        };
      }

      // Generate JWT token
      const token = jwt.sign(
        { username: user.username, id: user.id },
        process.env.JWT_SECRET || "default_secret_key",
        { expiresIn: "24h" }
      );

      // Don't return the password
      const userWithoutPassword = {
        id: user.id,
        username: user.username,
        score: user.score
      };

      return {
        status: "success",
        message: "User Login Success",
        code: 200,
        token,
        user: userWithoutPassword,
      };
    } catch (error) {
      console.error("Error logging in:", error);
      return {
        status: "error",
        message: "Internal Server Error",
        code: 500,
      };
    }
  }
}
