import { Router } from "express";
import UserRoutes from "./routes/user";
import AdminRoutes from "./routes/admin";
import GameRoutes from "./routes/game";

const router = Router();

router.use("/user", UserRoutes);
router.use("/admin", AdminRoutes);
router.use("/game", GameRoutes);

//HEALTH CHECK
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is up and running",
    timestamp: new Date().toISOString(),
  });
});

export default router;