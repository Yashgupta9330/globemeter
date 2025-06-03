import { Router, Request, Response } from "express"
import { handleCreateUser, handleLoginUser, handleGetUserByUsername, handleCheckUsername, handleValidateUser } from "@controllers/user"

const userRoutes = Router()

// Routes
userRoutes.post("/signup", async (req: Request, res: Response) => {
  await handleCreateUser(req, res)
})

userRoutes.post("/signin", async (req: Request, res: Response) => {
  await handleLoginUser(req, res)
})

userRoutes.get("/validate", async (req: Request, res: Response) => {
  await handleValidateUser(req, res)
})

userRoutes.get("/username/:username", async (req: Request, res: Response) => {
  await handleGetUserByUsername(req, res)
})

userRoutes.get("/check/:username", async (req: Request, res: Response) => {
  await handleCheckUsername(req, res)
})

export default userRoutes