import jwt from 'jsonwebtoken'
import User from '../models/userModel'
import { Request, Response, NextFunction } from 'express'
import dotenv from 'dotenv'

dotenv.config()


export const requireAuth = async(req: Request, res: Response, next: NextFunction)=>{
    const { authorization } = req.headers;

    if(!authorization){
        return res.status(401).json({error: 'Authentication required'})
    }

    const token = authorization.split(' ')[1]

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as jwt.JwtPayload;
        const {id} = decodedToken;
        req.user = await User.findOne({_id: id}).select('name email')//select just name and email from the document with that id
        next();
    } catch (error){
        console.log(error)
        return res.status(401).json({error: 'Request is not authorized'}) 
    }
}