const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const {
    registerUser,
    loginUser
} = require("../controllers/authcontroller");

/**
 * POST /auth/register
 * User registration with validation
 */
router.post(
    "/register", [
        body("username")
        .notEmpty()
        .withMessage("Username is required"),

        body("email")
        .isEmail()
        .withMessage("Valid email is required"),

        body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters")
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    },
    registerUser
);

/**
 * POST /auth/login
 * User login with validation
 */
router.post(
    "/login", [
        body("email")
        .isEmail()
        .withMessage("Valid email is required"),

        body("password")
        .notEmpty()
        .withMessage("Password is required")
    ],
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            });
        }
        next();
    },
    loginUser
);

module.exports = router;