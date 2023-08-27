import path from 'path'
import { StatusCodes } from 'http-status-codes'
import sanitizeHTML from 'sanitize-html'
import User from '../models/User'
import { NextFunction } from 'express'
import { asyncWrapper } from '../middleware/async'
interface ICleanData {
  name: string
  email: string
  password: string
}
interface IUser {
  name: string
  email: string
  password: string
  createJWT(): string
  comparePassword(password: string): Promise<boolean>
}
interface IRequest {
  body: IUser
  cleanData: ICleanData
}

interface IResponse {
  status(code: number): IResponse
  json(data: any): void
}

export const register = asyncWrapper(async (req: IRequest, res: IResponse) => {
  if (!req.cleanData.email || !req.cleanData.password || !req.cleanData.name) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Please provide name, email and password' })
  }
  const user = await User.create({ ...req.cleanData })
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ name: user.name, token: token, id: user._id, email: user.email })
})
export const login = asyncWrapper(async (req: IRequest, res: IResponse) => {
  if (!req.cleanData.email || !req.cleanData.password) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Please provide email and password' })
  }
  const user = await User.findOne({ email: req.cleanData.email })
  if (!user) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'User was not found' })
  }
  const isPasswordCorrect = await user?.comparePassword(req.cleanData.password)
  if (!isPasswordCorrect) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Invalid Credentials' })
  }
  const token = user?.createJWT()
  res.status(StatusCodes.OK).json({ name: user?.name, token: token, id: user?._id })
})

export function ourCleanup(req: IRequest, res: IResponse, next: NextFunction): void {
  if (typeof req.body.name != 'string') req.body.name = ''
  if (typeof req.body.email != 'string') req.body.email = ''
  if (typeof req.body.password != 'string') req.body.password = ''
  req.cleanData = {
    name: sanitizeHTML(req.body.name.trim(), { allowedTags: [], allowedAttributes: {} }),
    email: sanitizeHTML(req.body.email.trim(), { allowedTags: [], allowedAttributes: {} }),
    password: sanitizeHTML(req.body.password.trim(), { allowedTags: [], allowedAttributes: {} }),
  } as ICleanData
  next()
}
