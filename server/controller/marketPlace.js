const getEmployerModel = require("../model/employer");
const getMarketPlaceModel = require("../model/marketPlace");

exports.movetoMarket = async (req, res) => {
  try {

    const Employer = await getEmployerModel();
    const employer = await Employer.findById(req.body.employer);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    // Get the marketplace model associated with the employer's tenant ID
    const marketPlace = await getMarketPlaceModel(employer?.tenant_id);

    const product = req.body.products; // Now handling a single product, not an array

    // Check if the product already exists in the marketplace
    const existingProduct = await marketPlace.findOne({
      product: product, // Match the ObjectId of the product
      employer: employer._id,
    });

    if (existingProduct) {
      return res.status(409).json({
        message: `Product is already in the marketplace`,
      });
    }

    // Create a new marketplace document for the product
    const newMarketplaceProduct = new marketPlace({
      product: product, // Reference the single product here
      employer: employer._id,
    });
    await newMarketplaceProduct.save();

    return res
      .status(200)
      .json({ message: "Product moved to marketplace successfully" });
  } catch (error) {

    return res.status(500).json({ error: "Internal server error" });
  }
};


exports.getMarketPlacePro = async (req, res) => {

  try {
    const employerId = req.params.id;
    const Employer = await getEmployerModel();
  const employer = await Employer.findById(employerId);
 
   const marketPlace = await getMarketPlaceModel(employer?.tenant_id)

   const marketOfEmployer = await marketPlace.find().populate("product").exec()
  
    return res.status(200).json({ msg: "employer marketplace fetched successfully", marketOfEmployer });
  } catch (error) {
   
    return res.status(500).json({ msg: "Something went wrong" });
  }
};


exports.getMarketPlaceProIndividual = async (req, res) => {

  try {
    // Get employerId from req.body instead of req.params
    const { employerId ,productId} = req.body;

    // Fetch the employer based on the provided employerId
    const Employer = await getEmployerModel();
    const employer = await Employer.findById(employerId);

    if (!employer) {
      return res.status(404).json({ msg: "Employer not found" });
    }

    // Fetch the marketplace associated with the employer's tenant_id
    const marketPlace = await getMarketPlaceModel(employer?.tenant_id);

    // Populate the products in the marketplace
    const marketOfEmployer = await marketPlace.findOne({product:productId}).populate("product").exec();

    return res.status(200).json({ msg: "Employer marketplace fetched successfully", marketOfEmployer });
  } catch (error) {
  
    return res.status(500).json({ msg: "Something went wrong" });
  }
};

exports.getMarketPlaceProAll = async (req, res) => {

  try {
    // Get employerId from req.body instead of req.params
    const { employerId } = req.body;

    // Fetch the employer based on the provided employerId
    const Employer = await getEmployerModel();
    const employer = await Employer.findById(employerId);

    if (!employer) {
      return res.status(404).json({ msg: "Employer not found" });
    }

    // Fetch the marketplace associated with the employer's tenant_id
    const marketPlace = await getMarketPlaceModel(employer?.tenant_id);

    // Populate the products in the marketplace
    const marketOfEmployer = await marketPlace.find().populate("product").exec();

    return res.status(200).json({ msg: "Employer marketplace fetched successfully", marketOfEmployer });
  } catch (error) {
  
    return res.status(500).json({ msg: "Something went wrong" });
  }
};





exports.deleteFromMarket = async (req, res) => {

  try {
    const {employer, product} = req.body; // Expecting product and employer IDs in the request body


    if (!product || !employer) {
      return res.status(400).json({ message: "Product and employer IDs are required" });
    }
    // Find the employer based on the ID
    const Employer = await getEmployerModel();
    const employerDoc = await Employer.findById(employer);
    if (!employerDoc) {
      return res.status(404).json({ message: "Employer not found" });
    }

    // Get the marketplace model associated with the employer's tenant ID
    const marketPlace = await getMarketPlaceModel(employerDoc.tenant_id);

    // Find and delete the product from the marketplace
    const deletedProduct = await marketPlace.findOneAndDelete({
      product: product, // Match the ObjectId of the product
      employer: employerDoc._id,
    });

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found in the marketplace" });
    }

    // After deletion, fetch the updated list of products in the marketplace
    const updatedMarketplaceProducts = await marketPlace.find().populate("product").exec();

    // Return success message along with updated marketplace products
    return res.status(200).json({
      message: "Product deleted from marketplace successfully",
      updatedMarketplaceProducts,
    });
  } catch (error) {
    
    return res.status(500).json({ error: "Internal server error" });
  }
};






