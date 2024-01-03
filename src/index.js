// require('dotenv').config({ path: './env' })

import dotenv from 'dotenv'
// import mongoose from 'mongoose';
import connectDB from './db/index.js';
// import  {DB_NAME}  from '../constants.js';

dotenv.config({
    path: './env'
})


connectDB();




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
