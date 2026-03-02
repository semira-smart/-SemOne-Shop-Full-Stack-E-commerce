const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { protect } = require("../middleware/auth");

const {
    createOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

// ====================
// Optional: Input Validation Middleware
// ====================
const validateOrder = [
    body("products")
    .isArray({ min: 1 })
    .withMessage("Products array cannot be empty"),
    body("products.*.product")
    .notEmpty()
    .withMessage("Product ID is required"),
    body("products.*.quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ success: false, errors: errors.array() });
        next();
    }
];

// ====================
// Routes
// ====================

// Create a new order (authenticated)
router.post("/", protect, validateOrder, createOrder);

// Get orders for logged-in user
router.get("/myorders", protect, getUserOrders);

// Admin: get all orders
router.get("/", protect, getAllOrders);

// Admin: update order status
router.put("/:id/status", protect, updateOrderStatus);

module.exports = router;