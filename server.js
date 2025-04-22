import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { TransactionRouter } from "./src/routes/TransactionRoute.js";
import { UserRouter } from "./src/routes/UserRoutes.js";

dotenv.config();

const app = express();
const PORT = 8000;

//MiddleWares
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

//Routes
app.use("/api/transaction", TransactionRouter);
app.use("/api/user", UserRouter);

//DB connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connected.");
  })
  .catch((error) => console.error("Error connecting to MongoDB:", error));

//Run server
app.listen(PORT, () => {
  console.log(`Server listening to port : ${PORT}`);
});
