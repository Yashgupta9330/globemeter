import express, { Router } from "express";
import AdminController from "../controllers/admin";
import AdminService from "../services/admin";
import AdminModel from "../models/admin";
import { authenticate } from "../middleware/auth";


const AdminRoutes = Router()
const adminModel = new AdminModel();
const adminService = new AdminService(adminModel);
const adminController = new AdminController(adminService);

AdminRoutes.post("/add",authenticate, (req, res) => {
    adminController.handleAddInfo(req, res)
})


export default AdminRoutes;