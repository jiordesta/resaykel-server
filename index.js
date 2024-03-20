import "express-async-errors";
import express from "express";
import * as dotenv from "dotenv";
import morgan from "morgan";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
///imports
import { error_handler } from "./middlewares/error_handler.js";
import { cors_options } from "./configs/cors_options.js";
///routers
import user_router from "./routers/user_router.js";
import product_router from "./routers/product_router.js";

///configuration
dotenv.config();
const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors(cors_options));

///routers
app.use("/user", user_router);
app.use("/product", product_router);

//errors
app.use(error_handler);
app.use("*", (req, res) => {
  res.status(404).json({ message: "Not Found!" });
});

const PORT = process.env.PORT;

try {
  await mongoose.connect(process.env.MONGO_URL);
  app.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT:${PORT}`);
  });
} catch (error) {
  process.exit(1);
}
