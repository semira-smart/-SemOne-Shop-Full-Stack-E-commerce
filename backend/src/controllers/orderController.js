const Order = require("../models/order");
const Product = require("../models/Product");

/*
    Create an order
 */
exports.createOrder = async(req, res) => {
    try {
        const { products, address, phone, paymentMethod } = req.body; // [{ product: productId, quantity: 2 }]
        if (!products || products.length === 0) {
            return res.status(400).json({ success: false, message: "No products provided" });
        }
        if (!address || !phone) {
            return res.status(400).json({ success: false, message: "Address and phone are required" });
        }

        // Calculate total price
        let totalPrice = 0;
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) return res.status(404).json({ success: false, message: "Product not found" });
            totalPrice += product.price * (item.quantity || 1);
        }

        const order = await Order.create({
            user: req.user.userId,
            products,
            totalPrice,
            address,
            phone,
            paymentMethod: paymentMethod || "Cash on Delivery",
        });

        res.status(201).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/*
    Get all orders for logged-in user
 */
exports.getUserOrders = async(req, res) => {
    try {
        const orders = await Order.find({ user: req.user.userId })
            .populate("products.product", "name price")
            .populate("user", "username email");
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// Admin: Get all orders

exports.getAllOrders = async(req, res) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const orders = await Order.find()
            .populate("products.product", "name price")
            .populate("user", "username email");
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};



//  Admin: Update order status
exports.updateOrderStatus = async(req, res) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const { status } = req.body; // "Pending", "Completed", "Cancelled"
        if (!status || !["Pending", "Completed", "Cancelled"].includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status" });
        }

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        order.status = status;
        await order.save();

        res.status(200).json({ success: true, order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
