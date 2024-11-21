// const express=require ("express");
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js"
import express from 'express';
import cookieParser from "cookie-parser";
import { connectDb } from './db/ConnectDb.js';
import path from "path";
import cors from "cors";
const app=express();
const __dirname = path.resolve();
app.use(express.json()); 
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser()); 
app.use(express.urlencoded({ extended: true }));//allows us to parse incoming requests:req.body 
dotenv.config();
app.use("/api/auth",authRoutes);
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}
const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
    connectDb();
    console.log("Server is running on port 5000");
})
app.get("/",(req,res)=>{
    res.send("Hello World!!!");
})
// 6UiiWEVpVpx9h39h