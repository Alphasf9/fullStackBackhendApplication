import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,  // frontend mai kis kis jageh se request accept karenge 
    credentials: true,
}));

app.use(express.json({ limit: "20kb" }));  //accepting json and limit is 20 kb here

app.use(express.urlencoded({ extended: true, limit: "20kb" })); // objects inside objects as, in url 

app.use(express.static("public"))  // pdf,image store for public asset

app.use(cookieParser());

// routes

import userRouter from './routes/user.routes.js'

// routes declaration

app.use("/api/v1/users", userRouter)// https://localhost:8000/api/v1/users/register



export default app;