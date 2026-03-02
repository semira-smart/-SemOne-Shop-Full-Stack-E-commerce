const mongoose = require("mongoose");

/**
 * User Schema
 * - username: unique + indexed
 * - email: unique + indexed
 * - password: hashed
 * - role: User or Admin
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true, // optimization
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true, //  optimization
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["User", "Admin"],
        default: "User",
    },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);