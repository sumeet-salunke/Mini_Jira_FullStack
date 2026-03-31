import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //basic validation 
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All the fields are required"
      });
    }

    //check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists. Instead login",
      });
    }
    //create user(hashing happens automatically)
    const user = await User.create({
      name, email, password
    });
    const token = generateToken(user._id);

    //send response
    res.status(200).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });


  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    })

  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password required",
      })
    }
    //find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials"
      })
    }
    //compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      })
    }
    //generate token
    const token = generateToken(user._id);
    res.status(200).json({
      message: 'Login Successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      }
    })

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    })
  }
}