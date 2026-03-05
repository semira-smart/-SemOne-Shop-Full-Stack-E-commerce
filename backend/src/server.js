require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Test route
app.get("/", (req, res) => res.send("E-commerce backend API is running"));

// Routes
app.use("/auth", require("./routes/auth")); // Auth routes
app.use("/products", require("./routes/products"));
// Products routes (placeholder)
app.use("/orders", require("./routes/orders"));
// Orders routes (placeholder)

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

server.on("error", (error) => {
    console.error("❌ Server failed to start:", error);
});
app.use("/admin", require("./routes/admin"));


const { errorHandler } = require("./middleware/errorHandler");
app.use(errorHandler);