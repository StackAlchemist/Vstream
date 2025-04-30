import express from 'express'
import { adminLogin, adminLogout, adminSignup } from '../controllers/adminController'

const adminRouter = express.Router()

adminRouter.post('/signup', adminSignup)
adminRouter.post('/login', adminLogin)
adminRouter.post('/logout', adminLogout)

export default adminRouter
