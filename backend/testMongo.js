require("dotenv").config();
const mongoose = require("mongoose");

async function testConnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ MongoDB Atlas connected successfully");
        process.exit(0);
    } catch (error) {
        console.error("❌ MongoDB connection failed");
        console.error(error.message);
        process.exit(1);
    }
}

testConnection();