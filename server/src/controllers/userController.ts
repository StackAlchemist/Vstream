import express, { Request, response, Response } from 'express'
import User from '../models/userModel'
import jwt from 'jsonwebtoken'
import { handleSignupErrors } from '../utils/errorHandler'
import dotenv from 'dotenv'

dotenv.config();

const maxAge = 24 * 60 * 60; // 24 hours


const createToken = (id: string)=>{
    return jwt.sign({id}, process.env.JWT_SECRET as jwt.Secret, {
        expiresIn: maxAge
    })
}

export const signup = async (req: Request, res: Response) =>{
    console.log(req.body)
    try {
        const { name, email, password, isAdmin } = req.body
        
        const user = await User.create({
            name,
            email,
            password,
            isAdmin
        })

        const token = createToken(user._id.toString())
        res.cookie('authToken', token, {httpOnly: true, maxAge: maxAge * 1000})

        res.status(201).json({message: 'Welcome Onboard', user: {id: user._id, name: user.name}, token})
    } catch (err) {
    console.error('Failed to create user:', err);
    const errors = handleSignupErrors(err);
    res.status(400).json({ errors });
    }
}


export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.login(email, password);
    const token = createToken(user._id.toString());
    res.cookie("authToken", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res
      .status(200)
      .json({
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

export const logout = async (req: Request, res: Response) => {
  try {
    res.cookie("authToken", "", { httpOnly: true, maxAge: 0 });
    res.status(200).json({ message: "logout successful" });
  } catch (err) {
    console.error('Logout', err)
    res.status(500).json({message: 'Internal Server Error'})
  }
};