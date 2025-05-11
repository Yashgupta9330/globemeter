// app.ts or index.ts
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser"; // Added for handling cookies
import router from "./routes";


const port = process.env.PORT || 4000;


// APP INITIALIZATION
const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies for authentication

// ROUTES
app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/v1", router);

// START SERVER
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;

