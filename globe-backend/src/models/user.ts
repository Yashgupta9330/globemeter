import prisma from "../db";
import bcrypt from "bcrypt";
import { IuserData, IuserInput } from "../interfaces/user";
import IStatusMap from "../interfaces/statusMap";


export default class UserModel {
  private prisma = prisma;

  async getUserById(id: string): Promise<IuserData | null> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) return null;
      return {
        id: user.id,
        username: user.username,
        score: user.maxScore,
        password: user.password, // Don't return actual password
      };
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("Error fetching user");
    }
  }

  async createUser(user: IuserData): Promise<IStatusMap> {
    try {
      const isUsernameAlreadyRegistered = await this.prisma.user.findUnique({
        where: { username: user.username },
      });

      if (isUsernameAlreadyRegistered) {
        return {
          status: "error",
          message: "Username already registered",
          code: 400,
        };
      }
      
      const hashedPassword: string = await bcrypt.hash(user.password, 10);
      const newUser: IuserInput = {
        username: user.username,
        password: hashedPassword,
      };
      
      const createdUser = await this.prisma.user.create({ data: newUser });
      
      return {
        status: "success",
        message: "User created successfully",
        code: 201,
        user: {
          id: createdUser.id,
          username: createdUser.username,
          score: createdUser.maxScore
        },
      };
    } catch (error) {
      console.error("Error creating user:", error);
      return {
        status: "error",
        message: "Error creating user",
        code: 500,
      };
    }
  }

  public async getUserByUsername(username: string): Promise<IuserData | null> {
    try {
      const user = await this.prisma.user.findUnique({ where: { username } });
      if (!user) return null;
      return {
        id: user.id,
        username: user.username,
        password: user.password,
        score: user.maxScore 
      };
    } catch (error) {
      console.error("Error fetching user by username:", error);
      throw new Error("Error fetching user by username");
    }
  }

  public static async updateUserScore(userId: string, score: number) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });
      
      if (!user) {
        return null;
      }

      if (score > user.maxScore) {
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: {
            maxScore: score
          }
        });
        
        return updatedUser;
      }
      
      return user;
    } catch (error) {
      console.error('Error in updateUserScore:', error);
      return null;
    }
  }
}
