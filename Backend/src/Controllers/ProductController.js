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

// 🔹 Get All Products (With Advanced Search, Filters, Sort, and Pagination)
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search,
      category,
      brand,
      sku,
      tag,
      minPrice,
      maxPrice,
      rating,
      available,
      discounted,
      featured,
      newArrival,
      sort,
    } = req.query;

    const query = {};

    // 1. Partial/Regex search on name, description, brand
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
      ];
    }

    // 2. Category filter (ObjectId or Category Slug)
    if (category) {
      const mongoose = require("mongoose");
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const foundCategory = await CategoryModel.findOne({ slug: category });
        if (foundCategory) {
          query.category = foundCategory._id;
        } else {
          return res.status(200).json({ data: [], page: Number(page), pages: 0, total: 0 });
        }
      }
    }

    // 3. Brand
    if (brand) {
      query.brand = { $regex: brand, $options: "i" };
    }

    // 4. SKU
    if (sku) {
      query.sku = sku;
    }

    // 5. Tags
    if (tag) {
      query.tags = tag;
    }

    // 6. Price Range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 7. Rating
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // 8. Availability
    if (available === "true") {
      query.countInStock = { $gt: 0 };
    } else if (available === "false") {
      query.countInStock = 0;
    }

    // 9. Discount
    if (discounted === "true") {
      query.discount = { $gt: 0 };
    }

    // 10. Featured
    if (featured === "true") {
      query.isFeatured = true;
    }

    // 11. New Arrival
    if (newArrival === "true") {
      query.isNewArrival = true;
    }

    // --- SORTING ---
    let sortQuery = { createdAt: -1 }; // default newest first
    if (sort) {
      switch (sort) {
        case "price_asc":
          sortQuery = { price: 1 };
          break;
        case "price_desc":
          sortQuery = { price: -1 };
          break;
        case "newest":
          sortQuery = { createdAt: -1 };
          break;
        case "oldest":
          sortQuery = { createdAt: 1 };
          break;
        case "rating_desc":
          sortQuery = { rating: -1 };
          break;
        case "best_selling":
        case "popular":
          sortQuery = { numReviews: -1, rating: -1 };
          break;
      }
    }

    // --- PAGINATION ---
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const total = await ProductModel.countDocuments(query);
    const products = await ProductModel.find(query)
      .populate("category", "name")
      .sort(sortQuery)
      .skip(skip)
      .limit(limitNum);

    const productsWithCategoryName = products.map((p) => ({
      ...p.toObject(),
      image: p.image || null,
      categoryName: p.category?.name || "",
    }));

    res.status(200).json({
      data: productsWithCategoryName,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      total,
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    res.status(500).json({ message: "Server error while fetching products" });
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
