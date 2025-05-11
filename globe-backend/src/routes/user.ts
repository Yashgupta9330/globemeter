import { Router } from "express"

const UserRoutes = Router()
import UserController from "../controllers/user"
import UserModel from "../models/user"
import UserService from "../services/user"

const userModel = new UserModel()
const userService = new UserService(userModel)
const userController = new UserController(userService)

UserRoutes.post("/signup", (req, res) => {
  userController.createUser(req, res)
})

UserRoutes.post("/signin", (req, res) => {
  userController.loginUser(req, res)
})

UserRoutes.get("/username/:username",(req, res) => {
  userController.handleCheckUsername(req, res)
});

UserRoutes.get("/validate",(req, res) => {
  userController.handleValidateUser(req, res)
});

export default UserRoutes