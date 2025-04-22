import Router from "express";
import {
  addNewTransaction,
  deleteTransaction,
  fetchAllTransactionData,
  updateNewTransaction,
} from "../controllers/TransactionController.js";

export const TransactionRouter = Router();

TransactionRouter.get("/get-all-transaction/:userId", fetchAllTransactionData);
TransactionRouter.post("/add-new-transaction", addNewTransaction);
TransactionRouter.put("/update-transaction/:id", updateNewTransaction);
TransactionRouter.delete("/delete-transaction/:id", deleteTransaction);
