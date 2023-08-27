import { any } from 'joi';
import mongoose, { Document } from 'mongoose'
const Schema = mongoose.Schema;
interface IAddress{
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
      country: string;
}
export interface IFormData  {
    name: string;
    email: string;
    phone: string;
    address: any
    files?: File[]
    geolocationStatus: string;
  }
  
const AddressSchema = new Schema({
  line1: String,
  line2: String,
  city: String,
  state: String,
  pincode: String,
  country: String
});

const FormSchema = new Schema({
  name: String,
  email: String,
  phone: String,
  address: AddressSchema,
  files:[{id:String,name:String}],
  languages:[String],
  geolocationStatus: String
},
{timestamps:true}
);
const MainFormSchema=new Schema({
  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user'],
  },
  forms:[FormSchema],
 
},

{ timestamps: true }
)
export default mongoose.model('Form', MainFormSchema)