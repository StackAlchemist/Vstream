import express, { Request, response, Response } from 'express'
import User from '../models/userModel'
import jwt from 'jsonwebtoken'
import { handleSignupErrors } from '../utils/errorHandler'

export const signup = async (req: Request, res: Response) =>{
    console.log(req.body)
    try {
        const { name, email, password, isAdmin } = req.body
        
        
        await User.create({
            name,
            email,
            password,
            isAdmin
        })

        res.status(201).json({message: 'Welcome Onboard'})
    } catch (error) {
        console.error(error)
        res.status(400).json({message: 'Oops SignUp Failed'})
    }
}


export const login = async (req: Request, res: Response)=>{
    try {
        const {email, password} = req.body;
        const user  = await User.login(email, password)
        res.status(200).json({message: 'successful login'})
    } catch (err) {
    console.error('Failed to create user:', err);
    const errors = handleSignupErrors(err);
    res.status(400).json({ errors });
    }
}