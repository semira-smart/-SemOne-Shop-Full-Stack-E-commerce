const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/order");

/**
 * Admin Dashboard Stats
 */
exports.getDashboardStats = async(req, res) => {
    try {
        const users = await User.countDocuments();
        const products = await Product.countDocuments();
        const orders = await Order.countDocuments();

        res.status(200).json({
            success: true,
            stats: {
                users,
                products,
                orders
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Admin creates another Admin user
 * POST /admin/register
 * Requires authenticated Admin
 */
exports.registerAdmin = async (req, res) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ success: false, message: "Username already taken" });
        }
        const bcrypt = require("bcrypt");
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await User.create({
            username,
            email,
            password: hashedPassword,
            role: "Admin",
        });
        res.status(201).json({ success: true, user: { id: admin._id, username: admin.username, email: admin.email, role: admin.role } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
