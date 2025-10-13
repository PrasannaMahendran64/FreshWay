const path = require("path");
const ProductModel = require("../Models/ProductModel");
const CategoryModel = require("../Models/CategoryModel");

// 🔹 Create Product
const createProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const ProductData = req.body;

    // Attach only filename if uploaded
    if (req.file) {
      ProductData.image = req.file.filename; // ✅ store filename only
    }

    const newProduct = new ProductModel(ProductData);
    await newProduct.save();

    res.status(201).send({
      message: "Product created successfully",
      data: {
        ...newProduct.toObject(),
        image: newProduct.image || null, // ✅ return filename only
      },
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).send({ message: error.message || "Error creating Product" });
  }
};

// 🔹 Get All Products
const getProducts = async (req, res) => {
  try {
    // Populate category name
    const Products = await ProductModel.find().populate("category", "name");

    const ProductsWithImage = Products.map((p) => ({
      ...p.toObject(),
      image: p.image || null,
      categoryName: p.category?.name || "", // safe access
    }));

    res.status(200).send({ data: ProductsWithImage });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).send({ message: "Server error" });
  }
};


// ✅ Controller: getProductByCategory.js
const getProductByCategory = async (req, res) => {
  try {
    const { slug } = req.params; // from URL /products/category/:slug

    // Find category by slug
    const category = await CategoryModel.findOne({ slug });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        data: [],
      });
    }

    // Find products under this category
    const products = await ProductModel.find({ category: category._id }).populate("category");

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found in this category",
        data: [],
      });
    }

    // ✅ Consistent response format
    res.status(200).json({
      success: true,
      message: `Products for category: ${category.name}`,
      data: products.map((p) => ({
        ...p.toObject(),
        image: p.image || null,
      })),
    });
  } catch (error) {
    console.error("Get Product By Category Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      data: [],
    });
  }
};






// 🔹 Get Product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const Product = await ProductModel.findById(id);

    if (!Product) return res.status(404).send({ message: "Product not found" });

    res.status(200).send({
      data: {
        ...Product.toObject(),
        image: Product.image || null, // ✅ filename only
      },
    });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).send({ message: "Server error" });
  }
};

// GET /get-product/slug/:slug
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await ProductModel.findOne({ slug }).populate("category");

    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    res.status(200).send({
      data: {
        ...product.toObject(),
        image: product.image || null,
      },
    });
  } catch (error) {
    console.error("Get Product By Slug Error:", error);
    res.status(500).send({ message: "Server error" });
  }
};

// 🔹 Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.image = req.file.filename; // ✅ update filename only
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updatedProduct) return res.status(404).send({ message: "Product not found" });

    res.status(200).send({
      message: "Product updated successfully",
      data: {
        ...updatedProduct.toObject(),
        image: updatedProduct.image || null, // ✅ filename only
      },
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).send({ message: "Server error" });
  }
};

// 🔹 Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ProductModel.findByIdAndDelete(id);

    if (!deleted) return res.status(404).send({ message: "Product not found" });

    res.status(200).send({
      message: "Product deleted successfully",
      data: {
        ...deleted.toObject(),
        image: deleted.image || null, // ✅ filename only
      },
    });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).send({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  getProductByCategory,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
