import User from '../models/User'
import Jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { asyncWrapper } from './async';
import { StatusCodes } from 'http-status-codes'
import { NextFunction } from 'express';

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  name: string;
}
const authorization = asyncWrapper(async (req: any, res: any, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer')) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'connection invalid' })
  }
  try {
    const token = auth.split(' ')[1];
    const payload = Jwt.verify(token, process.env.JWT_SECRET!) as CustomJwtPayload
    req.user = { userId: payload.userId, userName: payload.name };
    next();
  } catch (error) {
    console.log(error)
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Authentication failed' })
  }

});

export default authorization;
