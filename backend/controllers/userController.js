import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// CREATE TOKEN
const createToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET
  );
};

// LOGIN USER / ADMIN
const loginUser = async (req, res) => {

  const { email, password } = req.body;

  try {

    // ADMIN LOGIN
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {

      const adminToken = jwt.sign(
        {
          id: "admin123",
          role: "admin",
        },
        process.env.JWT_SECRET
      );

      return res.json({
        success: true,
        token: adminToken,
        role: "admin",
        userId: "admin123",
      });
    }

    // NORMAL USER LOGIN
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        message: "User Doesn't exist",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = createToken(
      user._id,
      user.role
    );

    res.json({
      success: true,
      token,
      role: user.role,
      userId: user._id,
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: "Error",
    });
  }
};

// REGISTER USER
const registerUser = async (req, res) => {

  const { name, email, password } = req.body;

  try {

    // CHECK USER EXISTS
    const exists = await userModel.findOne({ email });

    if (exists) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    // VALIDATE EMAIL
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter valid email",
      });
    }

    // VALIDATE PASSWORD
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    // HASH PASSWORD
    const salt = await bcrypt.genSalt(
      Number(process.env.SALT)
    );

    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );

    // CREATE USER
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    const user = await newUser.save();

    const token = createToken(
      user._id,
      user.role
    );

    res.json({
      success: true,
      token,
      role: user.role,
      userId: user._id,
    });

  } catch (error) {

    console.log(error);

    res.json({
      success: false,
      message: "Error",
    });
  }
};

export {
  loginUser,
  registerUser,
};