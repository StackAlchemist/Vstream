import express, { Request, Response } from "express";
import User from "../models/userModel";
import jwt, { Secret } from "jsonwebtoken";
import { handleSignupErrors } from "../utils/errorHandler";
import dotenv from "dotenv";

dotenv.config();

const maxAge = 24 * 60 * 60; // 24 hours

// --- Token Helper ---
const createToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as Secret, {
    expiresIn: maxAge,
  });
};

// --- Signup ---
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, isAdmin } = req.body;

    const user = await User.create({ name, email, password, isAdmin });

    const token = createToken((user._id as any).toString());
    res.cookie("authToken", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(201).json({
      message: "Welcome Onboard",
      user: { id: user._id, name: user.name },
      token,
    });
  } catch (err) {
    console.error("Failed to create user:", err);
    const errors = handleSignupErrors(err);
    res.status(400).json({ errors });
  }
};

// --- Login ---
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.login(email, password);
    const token = createToken((user._id as any).toString());

    res.cookie("authToken", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({
      message: "Welcome Back!",
      user: { id: user._id, name: user.name },
      token,
    });
  } catch (err) {
    console.error("Failed to login user:", err);
    const errors = handleSignupErrors(err); // consider making a `handleLoginErrors`
    res.status(400).json({ errors });
  }
};

// --- Logout ---
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("authToken", "", { httpOnly: true, maxAge: 0 });
    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
