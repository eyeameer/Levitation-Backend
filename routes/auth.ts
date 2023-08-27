import express from 'express'

export const authRouter=express.Router()
import {register,login,ourCleanup} from '../controllers/auth'
authRouter.post('/register',ourCleanup as any,register as any)
authRouter.post('/login',ourCleanup as any ,login as any)