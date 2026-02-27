import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors  from 'cors';
import userRoutes from './src/routes/user.routes.js';


const app =  express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true}));


dotenv.config();
app.use("/api",userRoutes)


mongoose.connect(process.env.MONGODB_URI)
.then(()=>{
    console.log("mongodb connected successfully");
})
.catch((err)=>{
    console.log("mongodb not connected:",err)
})
app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`);
});