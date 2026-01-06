const Product = require("../models/productModel")

exports.addProduct = async (req, res) => {
    try {
       


        const products = Array.isArray(req.body)
            ? await Product.insertMany(req.body)
            : await Product.create(req.body);

        res.status(201).json({
            message: Array.isArray(req.body)
                ? "Products added successfully"
                : "Product added successfully",
            products
        });

    } catch (error) {
      
        res.status(400).json({ message: "Failed to add product" });
    }
};


exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products)
    }
    catch (error) {
        res.status(500).json({ message: "Failed to  fetch products" })
    }
}


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch product" });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({
      message: "Product updated successfully",
      updatedProduct
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to update product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product" });
  }
};

