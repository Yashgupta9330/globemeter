import { Router } from "express";
import { handleAddInfo } from "../controllers/admin";
import { authenticate } from "../middleware/auth";

const AdminRoutes = Router();

AdminRoutes.post("/add", authenticate, async (req, res) => {
    await handleAddInfo(req, res);
});

export default AdminRoutes;