import { Request, Response } from "express";
import * as userService from '../services/user';
import { IuserData } from "../interfaces/user";
import { IuserDataSchema, loginSchema } from "../zod/types";
import jwt from "jsonwebtoken";
import { DecodedToken } from "../middleware/auth";

export const handleCheckUsername = async (req: Request, res: Response): Promise<Response> => {
  try {
    const username = req.params.username;
    const response = await userService.getUserByUsername(username);
    if (!response) {
      return res.status(200).json({ success: true, message: "Username available" });
    }
    return res.status(200).json({ success: false, message: "Username already taken" });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

export const handleValidateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    console.log("Headers:", req.headers);
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Received token:", token);
    
    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key") as DecodedToken;
    console.log("Decoded token:", decoded);
    
    if (!decoded) {
      console.log("Token verification failed");
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }

    console.log("Looking up user with ID:", decoded.id);
    const user = await userService.getUserById(decoded.id);
    console.log("Found user:", user);

    if (!user) {
      console.log("User not found in database");
      return res.status(200).json({ success: false, message: "User not found" });
    }

    console.log("Returning user data");
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        score: user.score,
      },
    });
  } catch (error: any) {
    console.error("Validation error:", error);
    return res.status(400).json({ success: false, error: error.message });
  }
};

export const handleGetUserByUsername = async (req: Request, res: Response): Promise<Response> => {
  const { username } = req.params;
  try {
    const response = await userService.getUserByUsername(username);
    if (!response) {
      return res.status(200).json({ success: true, message: "User not found" });
    }
    return res.status(200).json({ success: false, message: "User already exists" });
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const handleCreateUser = async (req: Request, res: Response): Promise<Response> => {
  const body = req.body;
  try {
    const validatedData = IuserDataSchema.safeParse(body);
    if (!validatedData.success) {
      const errors = validatedData.error.issues.map(issue => issue.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }

    const user: IuserData = validatedData.data;
    const response = await userService.createUser(user);

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
};

export const handleLoginUser = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;
  try {
    const validatedData = loginSchema.safeParse({ username, password });
    if (!validatedData.success) {
      const errors = validatedData.error.issues[0].message;
      return res.status(400).json({ message: 'Validation error', errors });
    }

    const { username: validatedUsername, password: validatedPassword } = validatedData.data;
    const response = await userService.loginUser(validatedUsername, validatedPassword);

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
};
