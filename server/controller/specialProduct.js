const SpecialProduct = require('../model/specialProducts');

// Create a new special product
exports.createSpecialProduct = async (req, res) => {
    try {
        const product = await SpecialProduct.create(req.body);
        res.status(201).json({ msg: 'Product created successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error creating product', error: error.msg });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await SpecialProduct.findById(id).populate({
            path: "sub_products", 
            model: "subProducts"  
        })
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error fetching product', error: error.msg });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await SpecialProduct.find()
            .populate({
                path: "sub_products", 
                model: "subProducts"  
            })
            .sort({ createdAt: -1 });

        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error fetching products', error: error.message });
    }
};


// Get all products by supplier ID
exports.getProductsBySupplierId = async (req, res) => {
    const { supplierId } = req.params;
    try {
        const products = await SpecialProduct.find({ supplier: supplierId });
        if (!products || products.length === 0) {
            return res.status(404).json({ msg: 'No products found for this supplier' });
        }
        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error fetching products', error: error.msg });
    }
};

// Edit (update) a product by ID
exports.updateProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedProduct = await SpecialProduct.findByIdAndUpdate(id, req.body);
        if (!updatedProduct) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(200).json({ msg: 'Product updated successfully', updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error updating product', error: error.msg });
    }
};

// Delete a product by ID
exports.deleteProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await SpecialProduct.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(200).json({ msg: 'Product deleted successfully', deletedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error deleting product', error: error.msg });
    }
};
