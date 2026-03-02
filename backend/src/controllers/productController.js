const Product = require("../models/Product");

/*
    Create a new product
    Only logged-in users can create
 */
exports.createProduct = async(req, res) => {
    try {
        const { name, description, price, category, inStock, image } = req.body;
        if (!name || !price || !category) {
            return res.status(400).json({ success: false, message: "Name and price are required" });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            inStock: inStock ?? 0,
            image: image || "",
            createdBy: req.user.userId, // from JWT middleware
        });

        res.status(201).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get all products

exports.getAllProducts = async(req, res) => {
    try {
        const products = await Product.find().populate("createdBy", "username email");
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate("createdBy", "username email");
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/*
    Update a product
    Only creator or Admin can update
 */
exports.updateProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        // Check permissions
        if (req.user.role !== "Admin" && product.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const { name, description, price, inStock, category, image } = req.body;
        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (inStock !== undefined) product.inStock = inStock;
        if (category !== undefined) product.category = category;
        if (image !== undefined) product.image = image;

        await product.save();
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/*
    Delete a product
    Only creator or Admin can delete
 */
exports.deleteProduct = async(req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        // Check permissions
        if (req.user.role !== "Admin" && product.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        await product.deleteOne();

        res.status(200).json({ success: true, message: "Product deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Search products by name
exports.searchProducts = async(req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const products = await Product.find({
            name: { $regex: q, $options: "i" } // case-insensitive
        });

        res.status(200).json({
            success: true,
            products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
