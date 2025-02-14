const categories = require("../model/categories");
const Categories = require("../model/categories");
const Supplier = require("../model/supplier");


exports.createCategory = async (req, res) => {
  try {
    // Find the supplier by ID
    const supplier = await Supplier.findById(req.body.supplier);
    if (!supplier) {
      return res.status(404).json({ msg: "Supplier not found." });
    }

    // Check if the category with the same category_name and subCategory_name already exists
    const existingCategory = await Categories.findOne({
      category_name: req.body.category_name,
      subCategory_name: req.body.subCategory_name,
      supplier: supplier._id,
    });

    if (existingCategory) {
      return res.status(400).json({ msg: "Category & sub-category already exists." });
    }

    // Create a new category
    const category = new Categories({
      supplier: supplier._id,
      category_name: req.body.category_name,
      subCategory_name: req.body.subCategory_name
    });

    // Add the new category to the supplier's category_Subcategory array
    supplier.category_Subcategory.push(category._id);
    await supplier.save();
    await category.save();
    return res.status(201).json({ msg: "Successfully created.", category });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong." });
  }
};


exports.getAllCtegories = async (req, res) => {
  const id = req.params.id;
  try {
    const category = await Categories.find({ supplier: id })
      .sort({ createdAt: -1 })
      .populate("supplier")
      .exec();

    return res.status(200).json({ msg: "Success", category });
  } catch (error) {
    return res.status(500).json({ msg: "Something Went Wrong" });
  }
};


exports.getAllCategories1 = async (req, res) => {
  try {
    const category = await Categories.find().populate("supplier").exec();

    return res.status(200).json({ msg: "Success", category });
  } catch (error) {
    return res.status(500).json({ msg: "Something Went Wrong" });
  }
};

//get one
exports.getOne = async (req, res) => {
  try {
    const category = await Categories.findById(req.params.id);
    return res.status(201).json({ msg: "Successfully fetched one category", category });
  } catch (error) {
    res.status(401).json({ err: "Something went wrong !", error });
  }
};

//update

exports.updateCategory = async (req, res) => {
  try {
    const category = await categories.findById(req.params.id);

    await categories.updateOne({ _id: req.params.id }, req.body);

    await category.save();

    res.status(201).json({ msg: "Category Updated Successfully", category });
  } catch (error) {
    res.status(401).json({ msg: "Something went wrong !", error });
  }
};

//delete
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Categories.findByIdAndDelete({ _id: req.params.id });

    res.status(201).json({ msg: "Deleted Successfully", category });
  } catch (error) {
    res.status(401).json({ err: "Something went wrong !", error });
  }
};
