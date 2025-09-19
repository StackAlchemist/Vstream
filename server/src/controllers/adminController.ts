import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Directors from '../models/adminModel';
import { handleSignupErrors } from '../utils/errorHandler';

dotenv.config();

const maxAge = 1 * 24 * 60 * 60; 

const createToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: maxAge,
  });
};

// Admin Signup
export const adminSignup = async (req: Request, res: Response): Promise<void> => {
  console.log(req.body);
  try {
    const { name, email, password, isAdmin } = req.body;

    const user = await Directors.create({
      name,
      email,
      password,
      isAdmin,
    });

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

// Admin Login
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await (Directors as any).login(email, password);

    const token = createToken((user._id as any).toString());
    res.cookie("authToken", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({
      message: "Welcome Back!",
      user: { id: user._id, name: user.name },
      token,
    });
  } catch (err) {
    console.error("Failed to login user:", err);
    const errors = handleSignupErrors(err);
    res.status(400).json({ errors });
  }
};

//  Admin Logout
export const adminLogout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.cookie("authToken", "", { httpOnly: true, maxAge: 0 });
    res.status(200).json({ message: "logout successful" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
