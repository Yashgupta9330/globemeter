import IStatusMap from "../interfaces/statusMap";
import { IuserData } from "../interfaces/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db";

export async function getUserById(id: string): Promise<IuserData | null> {
  try {
    console.log("getUserById - Searching for user with ID:", id);
    const user = await prisma.user.findUnique({
      where: { id },
    });
    console.log("getUserById - Database query result:", user);
    
    if (!user) {
      console.log("getUserById - No user found");
      return null;
    }
    
    const userData = {
      id: user.id,
      username: user.username,
      score: user.maxScore,
      password: user.password,
    };
    console.log("getUserById - Returning user data:", userData);
    return userData;
  } catch (error) {
    console.error("getUserById - Error fetching user:", error);
    throw new Error("Error fetching user");
  }
}

export async function getUserByUsername(username: string): Promise<IuserData | null> {
  try {
    const user = await prisma.user.findUnique({ where: { username } });
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

export async function createUser(userData: IuserData): Promise<IStatusMap> {
  try {
    const isUsernameAlreadyRegistered = await prisma.user.findUnique({
      where: { username: userData.username },
    });

    if (isUsernameAlreadyRegistered) {
      return {
        status: "error",
        message: "Username already registered",
        code: 400,
      };
    }

    const hashedPassword: string = await bcrypt.hash(userData.password, 10);
    const createdUser = await prisma.user.create({
      data: {
        username: userData.username,
        password: hashedPassword,
      }
    });

    const token = jwt.sign(
      { username: createdUser.username, id: createdUser.id },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "24h" }
    );

    return {
      status: "success",
      message: "User Signup Success",
      code: 200,
      token,
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

export async function loginUser(username: string, password: string): Promise<IStatusMap> {
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return {
        status: "error",
        message: "User not found",
        code: 404,
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return {
        status: "error",
        message: "Password is incorrect",
        code: 401,
      };
    }

    const token = jwt.sign(
      { username: user.username, id: user.id },
      process.env.JWT_SECRET || "default_secret_key",
      { expiresIn: "24h" }
    );

    return {
      status: "success",
      message: "User Login Success",
      code: 200,
      token,
      user: {
        id: user.id,
        username: user.username,
        score: user.maxScore
      },
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
