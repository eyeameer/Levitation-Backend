import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

interface IUser extends Document {
  name: string
  email: string
  password: string
  createJWT(): string
  comparePassword(canditatePassword: string): Promise<boolean>
}

const UserSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 3,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
},
{ timestamps: true }
)

UserSchema.pre<IUser>('save', async function () {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})
 
UserSchema.methods.createJWT = function (): string {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET!,
    
  )
}

UserSchema.methods.comparePassword = async function (
  canditatePassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(canditatePassword, this.password)
  return isMatch
}

export default mongoose.model<IUser>('User', UserSchema)
