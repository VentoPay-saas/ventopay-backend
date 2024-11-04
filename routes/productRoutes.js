const express = require("express");
const router = express.Router();

// Product schema for data validation
const ProductOrder = {
  id: String,
  client: String,
  status: {
    type: String,
    enum: ["new", "progress", "completed"],
    default: "new",
  },
  number_of_products: Number,
  amount: Number,
  payment_type: {
    type: String,
    enum: ["cash", "credit", "debit"],
    default: "cash",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
};

// GET endpoint to fetch all products
router.get("/products", async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Add filtering support
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.payment_type) filter.payment_type = req.query.payment_type;
    if (req.query.client) filter.client = req.query.client;

    const products = await ProductOrder.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    const total = await ProductOrder.countDocuments(filter);

    res.json({
      status: "success",
      data: products,
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        items_per_page: limit,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch products",
      error: error.message,
    });
  }
});

// POST endpoint to create a new product order
router.post("/products", async (req, res) => {
  try {
    const { client, number_of_products, amount, payment_type } = req.body;

    // Validate required fields
    if (!client || !number_of_products || !amount) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields",
      });
    }

    // Create new product order
    const newProduct = new ProductOrder({
      client,
      number_of_products,
      amount,
      payment_type: payment_type || "cash",
      status: "new",
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      status: "success",
      message: "Product order created successfully",
      data: savedProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to create product order",
      error: error.message,
    });
  }
});

// GET endpoint to fetch a single product by ID
router.get("/products/:id", async (req, res) => {
  try {
    const product = await ProductOrder.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.json({
      status: "success",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to fetch product",
      error: error.message,
    });
  }
});

// PATCH endpoint to update product status
router.patch("/products/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["new", "progress", "completed"].includes(status)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid status value",
      });
    }

    const updatedProduct = await ProductOrder.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Product not found",
      });
    }

    res.json({
      status: "success",
      message: "Product status updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to update product status",
      error: error.message,
    });
  }
});

module.exports = router;
