import mongoose from "mongoose";

const connectToDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)

        console.log("Connected to DB successfully! 🎉");
        
    } catch (error) {
        console.error("DB Connection Failed! 😢", err);
        process.exit(1);
    }
}

export default connectToDB;