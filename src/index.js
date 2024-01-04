// require('dotenv').config({ path: './env' })

import dotenv from 'dotenv'
// import mongoose from 'mongoose';
import connectDB from './db/index.js';
// import  {DB_NAME}  from '../constants.js';

dotenv.config({
    path: './env'
})


connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("ERR: ", err);
            throw err;
        });
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is listening on port ${process.env.PORT}`)
        });
    })
    .catch((err) => {
        console.error('MONGODB connection failed: ' + err);
    })



















/*
import express from 'express';

const app = express();

; (async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error) => {
            console.log("ERR: ", err);
            throw err;
        })
        app.listen(process.env.PORT, () => {
            console.log(`app is listening on port ${process.env.PORT}`);
        })
    } catch (error) {
        console.error("ERROR: " + error)
        throw err
    }
})()
*/
