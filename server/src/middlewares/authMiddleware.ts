import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { Document } from "mongoose";

dotenv.config();

// Custom request type
export interface AuthRequest extends Request {
  user?: Document | null;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json({ error: "Authentication required" });
    return; // Explicit return to satisfy Promise<void>
  }

  const token = authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as jwt.JwtPayload;
    const { id } = decodedToken;

    req.user = await User.findOne({ _id: id }).select("name email");
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: "Request is not authorized" });
    return; 
  }
};
