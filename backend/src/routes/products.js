const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");

const { protect } = require("../middleware/auth");

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    searchProducts
} = require("../controllers/productController");

/**
 * GET /products
 * Public - get all products
 */
router.get("/", getAllProducts);

/**
 * GET /products/search?q=keyword
 * Public - search products
 */
router.get("/search", searchProducts);

/**
 * GET /products/:id
 * Public - get product by id
 */
router.get("/:id", getProductById);

/**
 * POST /products
 * Protected - create product
 */
router.post(
    "/",
    protect, [
        body("name").notEmpty().withMessage("Product name is required"),
        body("price").isNumeric().withMessage("Price must be a number"),
        body("category").notEmpty().withMessage("Category is required")
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
    createProduct
);

/**
 * PUT /products/:id
 * Protected - update product
 */
router.put("/:id", protect, updateProduct);

/**
 * DELETE /products/:id
 * Protected - delete product
 */
router.delete("/:id", protect, deleteProduct);

module.exports = router;
