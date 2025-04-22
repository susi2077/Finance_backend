import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { fName, lName, email, phone, password, preferredCurrency } =
      req.body;
    console.log(fName, lName, email, phone, password, preferredCurrency);
    if (!email || !fName || !password)
      return res.status(400).json({ message: "Missing details" });

    const userExists = await User.findOne({ email });
    if (!userExists) {
      const passwordHashed = bcrypt.hashSync(password, 10);

      const newUser = await User.create({
        fName,
        lName,
        email,
        password: passwordHashed,
        phone,
        preferredCurrency,
      });

      res
        .status(200)
        .json({ message: "User registration successfull!", user: newUser });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing email or password" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      userDetails: {
        _id: user._id,
        fName: user.fName,
        lName: user.lName,
        email: user.email,
        phone: user.phone,
        preferredCurrency: user.preferredCurrency,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      fName,
      lName,
      phone,
      email,
      preferredCurrency,
      oldPassword,
      newPassword,
    } = req.body;

    console.log(
      fName,
      lName,
      phone,
      email,
      preferredCurrency,
      oldPassword,
      newPassword
    );

    if (!userId)
      return res.status(400).json({ message: "User ID is required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if email is changed and ensure it's unique
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists)
        return res.status(400).json({ message: "Email already in use" });
      user.email = email;
    }

    // Update user details if provided
    if (fName) user.fName = fName;
    if (lName) user.lName = lName;
    if (phone) user.phone = phone;
    if (preferredCurrency) user.preferredCurrency = preferredCurrency;

    // Handle password change if both old and new passwords are provided
    if (oldPassword && newPassword) {
      const isMatch = bcrypt.compareSync(oldPassword, user.password);
      if (!isMatch)
        return res.status(401).json({ message: "Old password is incorrect" });

      user.password = bcrypt.hashSync(newPassword, 10);
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const verifyUserAndGetDetails = async (req, res) => {
  try {
    const { id } = req.params; // Get the token from the params

    // Verify the token and extract the user ID
    jwt.verify(id, process.env.SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
      }

      const { userId } = decoded; // Extract userId from decoded token

      // Fetch user details using the userId (you can implement this part as needed)
      const userDetails = await User.findById(userId);
      return res.status(200).json({
        userDetails: {
          _id: userDetails._id,
          fName: userDetails.fName,
          lName: userDetails.lName,
          email: userDetails.email,
          phone: userDetails.phone,
          preferredCurrency: userDetails.preferredCurrency,
        },
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Verification Failed", error });
  }
};
