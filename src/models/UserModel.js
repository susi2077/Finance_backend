import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fName: { type: String, required: true },
  lName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: Number },
  password: { type: String, required: true },
  preferredCurrency: { type: String, default: "NPR" },
});

const User = mongoose.model("User", UserSchema);
export default User;
