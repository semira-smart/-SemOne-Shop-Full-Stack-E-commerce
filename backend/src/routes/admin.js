const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");
const { getDashboardStats, registerAdmin } = require("../controllers/adminController");

/**
 * GET /admin/dashboard
 * Admin dashboard statistics
 */
router.get("/dashboard", protect, getDashboardStats);

/**
 * POST /admin/register
 * Create Admin user (Admin-only)
 */
router.post("/register", protect, registerAdmin);

module.exports = router;
