import express from "express"
import mongoose from "mongoose"
import authRoute from './routes/auth.js'
import attendanceRoute from './routes/attendance.js'
import userRoute from './routes/users.js'
import leaveRoute from './routes/leave.js'
import scheduleRoute from './routes/scheduling.js'
import { userImagesDir } from './utils/utils.js'
import cors from 'cors'
import cookieParser from "cookie-parser"
import dotenv from "dotenv";

const app = express()
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Connected to DB')
    } catch (error) {
        throw error;
    }
}

app.get('/', (req, res) => {
    res.send('hello! first request')
})

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});

const corsOptions = {
    origin: ['http://localhost:3000'],  // Allow your React app to access the backend
    optionsSuccessStatus: 200,
    credentials: true
};

//middlewares
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/uploads/user-photos', express.static(userImagesDir));

const PORT = process.env.PORT || 8800

app.use('/api/auth', authRoute)
app.use('/api/attendance', attendanceRoute)
app.use('/api/user', userRoute)
app.use('/api/leave', leaveRoute)
app.use('/api/scheduling', scheduleRoute)

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.listen(PORT, () => {
    connect()
    console.log('Connected to the backend!')
})