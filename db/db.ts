import mongoose, {ConnectOptions} from 'mongoose';
const connectDB = (url: string) => {
    return mongoose.connect(url, {
        useNewUrlParser : true,
        useUnifiedTopology: true,
    }as ConnectOptions);
}

export default connectDB;
