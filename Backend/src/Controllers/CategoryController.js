const CategoryModel = require("../Models/CategoryModel");

// 🔹 Create Category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Category name is required" });

    // Generate slug automatically
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // Check for duplicate slug
    const existing = await CategoryModel.findOne({ slug });
    if (existing) return res.status(400).json({ message: "Slug already exists" });

    // Attach image if uploaded
    let image = null;
    if (req.file) {
      image = req.file.filename; // ✅ store only filename
    }

    // Save category
    const category = new CategoryModel({ name, slug, image });
    await category.save();

    res.status(201).json({ message: "Category created successfully", data: category });
  } catch (err) {
    console.error("Create Category Error:", err);
    res.status(500).send("Server error");
  }
};

// 🔹 Get All Categories
const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    const categoriesWithImage = categories.map((c) => ({
      ...c.toObject(),
      image: c.image || null, // ✅ only filename
    }));

    res.status(200).json({ data: categoriesWithImage });
  } catch (err) {
    console.error("Get Categories Error:", err);
    res.status(500).send("Server error");
  }
};

// 🔹 Get Category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({
      data: {
        ...category.toObject(),
        image: category.image || null, // ✅ filename only
      },
    });
  } catch (err) {
    console.error("Get Category By ID Error:", err);
    res.status(500).send("Server error");
  }
};

// 🔹 Update Category
const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) return res.status(400).json({ message: "Category name is required" });

    // Generate new slug from updated name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const updateData = { name, slug };

    // Update image if uploaded
    if (req.file) {
      updateData.image = req.file.filename; // ✅ only filename
    }

    // Update category
    const updated = await CategoryModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ message: "Category updated successfully", data: updated });
  } catch (err) {
    console.error("Update Category Error:", err);
    res.status(500).send("Server error");
  }
};

// 🔹 Delete Category
const deleteCategory = async (req, res) => {
  try {
    const deleted = await CategoryModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Category not found" });

    res.status(200).json({
      message: "Category deleted",
      data: {
        ...deleted.toObject(),
        image: deleted.image || null,
      },
    });
  } catch (err) {
    console.error("Delete Category Error:", err);
    res.status(500).send("Server error");
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
