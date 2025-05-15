const Product = require("../../models/machineModel/Product");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "uploads/products";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format. Upload only JPEG/JPG or PNG"), false);
  }
};

// Initialize multer upload middleware
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: fileFilter,
}).single("productImage");

// Create a new product
exports.createProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(400).json({ message: err.message });
    }

    try {
      const { productName, productPrice, productDescription } = req.body;
      console.log("Request body:", req.body);
      console.log("Uploaded file:", req.file);

      // Validate required fields
      if (!productName || !productPrice || !productDescription) {
        if (req.file) fs.unlinkSync(req.file.path); // Cleanup on failure
        return res.status(400).json({ message: "All fields (productName, productPrice, productDescription) are required" });
      }

      const productData = {
        productName,
        productPrice,
        productDescription,
        productImage: req.file ? req.file.path : "", // Store without leading slash
      };

      console.log("Saving product:", productData);
      const newProduct = new Product(productData);
      await newProduct.save();

      res.status(201).json({ message: "Product added successfully", product: newProduct });
    } catch (error) {
      console.error("Error adding product:", error);
      if (req.file) fs.unlinkSync(req.file.path); // Cleanup on error
      res.status(500).json({ message: "Error adding product", error: error.message });
    }
  });
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// Update a product by ID
exports.updateProduct = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(400).json({ message: err.message });
    }

    try {
      const productId = req.params.id;
      const product = await Product.findById(productId);

      if (!product) {
        if (req.file) fs.unlinkSync(req.file.path);
        return res.status(404).json({ message: "Product not found" });
      }

      const updateData = { ...req.body };
      if (req.file) {
        if (product.productImage && fs.existsSync(product.productImage)) {
          fs.unlinkSync(product.productImage);
        }
        updateData.productImage = req.file.path;
      }

      const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      console.error("Error updating product:", error);
      if (req.file) fs.unlinkSync(req.file.path);
      res.status(500).json({ message: "Error updating product", error: error.message });
    }
  });
};

// Delete a product by ID
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.productImage && fs.existsSync(product.productImage)) {
      fs.unlinkSync(product.productImage);
    }

    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};