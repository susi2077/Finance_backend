import Transaction from "../models/TransactionModel.js";

export const addNewTransaction = async (req, res) => {
  try {
    const {
      userId,
      type,
      category,
      amount,
      currency,
      description,
      date,
      time,
    } = req.body;
    console.log(req.body);

    if (!userId)
      return res.status(400).json({ message: "User ID is required" });
    if (!amount)
      return res.status(400).json({ message: "Amount field cannot be null" });

    const newTransaction = await Transaction.create({
      userId,
      type,
      category,
      amount,
      currency,
      description,
      date,
      time,
    });

    res.status(201).json({
      message: "Transaction added successfully!",
      transaction: newTransaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const fetchAllTransactionData = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const allTransactions = await Transaction.find({ userId }).sort({
      date: -1,
      time: -1,
    });

    res.status(200).json({
      message: "Transactions fetched successfully!",
      transactions: allTransactions,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const updateNewTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, category, amount, currency, description, date, time } =
      req.body;
    if (!amount)
      return res.status(400).json({ message: "Amount field cannot be null" });

    const updatedTransaction = await Transaction.findOneAndUpdate(
      id,
      {
        type,
        category,
        amount,
        currency,
        description,
        date,
        time,
      },
      { new: true }
    );

    if (!updatedTransaction)
      return res.status(404).json({ message: "Transaction not found!" });

    res.status(200).json({
      message: "Transaction updated successfully!",
      transaction: updatedTransaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTransaction = await Transaction.findOneAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({
      message: "Transaction deleted successfully!",
      transaction: deletedTransaction,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong!" });
  }
};
