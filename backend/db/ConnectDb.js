import mongoose from "mongoose";
export const connectDb=async ()=>{
    try{const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Connected");
    }
    catch(err){
        console.log("Error connecting Db");
        process.exit(1);
    }
}