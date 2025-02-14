const SubProduct = require("../model/subProducts");


//Create a new SubProduct
exports.createSubproduct = async (req, res) => {
    try {
        const product = await SubProduct.create(req.body);
        res.status(201).json({ msg: "Product created successfully", product });
    } catch (error) {
        res.status(500).json({ msg: "Error creating Sub Product", error: error.msg })
    }
}

//Get a Single sub product by its ID
exports.getSubProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await SubProduct.findById(id).populate("vendors")
        if (!product) {
            return res.status(404).json({ msg: "product not found" });
        }
        res.status(200).json({ product })
    } catch (error) {
        res.status(500).json({ msg: "Error while fetching product", error: error.msg });
    }
}

//Get all sub products
exports.getAllSubProducts = async (req, res) => {
    try {
        const products = await SubProduct.find().populate("vendors").sort({createdAt:-1})
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching products', error: error.msg });
    }
}

//Get subproducts by supplied id 
exports.getSubProductsBySupplierId = async (req, res) => {
    const { supplierId } = req.params;
    try {
        const products = await SubProduct.find({ supplier: supplierId }).populate("vendors")
        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No products found", products });
        }
        res.status(200).json({ products });
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Error fetching products", error: error.msg });
    }
}

//Update subproduct
exports.updateSubProductById = async (req, res) => {
    const { id } = req.params;
    console.log("-----",req.body)
    try {
        const updatedsubPro = await SubProduct.findByIdAndUpdate(id, req.body)
        if (!updatedsubPro) {
            return res.status(404).json({ msg: "Product not found" });
        }
        res.status(200).json({ msg: "Product updated successfully", updatedsubPro });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error updating product', error: error.msg });
    }
}

//Delete Sub Product
exports.deleteSubProducts = async (req, res) => {
    const { id } = req.params
    try {
        const deletedSubPro = await SubProduct.findByIdAndDelete(id);
        if (!deletedSubPro) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(200).json({ msg: "Product deleted successfully", deletedSubPro })
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error deleting product', error: error.msg });
    }
}

