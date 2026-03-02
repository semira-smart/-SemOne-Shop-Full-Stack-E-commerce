const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/*
    POST /auth/register
    User Story 1: Signup
 */
exports.registerUser = async(req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingEmail = await User.findOne({ email: String(email).toLowerCase() });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: "Username already taken",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            username,
            email: String(email).toLowerCase(),
            password: hashedPassword,
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

/*
    POST /auth/login
    User Story 2: Login
 */
exports.loginUser = async(req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check user exists
        const user = await User.findOne({ email: String(email).toLowerCase() });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // 3. Generate JWT
        const token = jwt.sign({
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET, { expiresIn: "1d" }
        );

        return res.status(200).json({
            success: true,
            token,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
