import dotenv from 'dotenv';
dotenv.config();
import express, {Application} from 'express';
const app:Application = express();
import connectDB from './db/db'
import cors from 'cors';
import {authRouter} from './routes/auth'
import {formRouter} from './routes/form'
import authorization from './middleware/authorization'
const port = process.env.port || 5000;
app.use(cors({
    origin: '*'
}));
app.use(express.json())
app.use('/api',authRouter)
app.use('/api/forms',authorization, formRouter)
const start = async () => {
    const connection = await connectDB(process.env.MONGO_URI!);
    app.listen(port, () => console.log(`listening on port ${port}`));
}
start();

