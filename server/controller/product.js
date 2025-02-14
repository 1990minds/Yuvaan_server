const xlsx = require("xlsx");
const fs = require("fs");
const Product = require("../model/product");
const Supplier = require("../model/supplier");
const supplier = require("../model/supplier");

// exports.createProduct = async (req, res) => {
//   console.log(req.body);
//   try {
//     const supplier = await Supplier.findById(req.body.supplier);
//     const product = new Product();
//     product.supplier = supplier;
//     (product.product_type = req.body.product_type),
//       (product.product_name = req.body.product_name),
//       (product.category = req.body.category),
//       (product.subcategory = req.body.subcategory),
//       (product.description = req.body.description),
//       (product.offered_to = req.body.offered_to),
//       // product.employee_count_dependent= req.body.employee_count_dependent,
//       // product.min_no_of_employees= req.body.min_no_of_employees,
//       // product.turnOver_dependent= req.body.turnOver_dependent,
//       // product.demo_available= req.body.demo_available,
//       (product.price = req.body.price),
//       (product.discount = req.body.discount),
//       (product.inStock = req.body.inStock),
//       (product.brochure = req.body.brochure),
//       (product.product_image = req.body.product_image),
//       // product.admin_approval= req.body.admin_approval,
//       (product.rate_card = req.body.rate_card),
//       (product.quotation = req.body.quotation),
//       (product.service_for = req.body.service_for),
//       (product.supplier = req.body.supplier),
//       (product.file_type = req.body.file_type),

//       supplier?.products?.push(product);
//     await supplier?.save();
//     await product?.save();
//     return res
//       .status(201)
//       .json({ msg: "Products created successfully.", product });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ msg: "Something went wrong." });
//   }
// };

//bulk upload


exports.createProduct = async (req, res) => {

  try {
    const supplier = await Supplier.findById(req.body.supplier);
    const product = new Product({
      product_type: req.body.product_type,
      file_type: req.body.file_type,
      product_name: req.body.product_name,
      category: req.body.category,
      supplier: req.body.supplier,
      subcategory: req.body.subcategory,
      product_image: req.body.product_image,
      admin_approval: req.body.admin_approval,
      // offered_to: req.body.offered_to,
      // price: req.body.price,
      // discount: req.body.discount,
      // inStock: req.body.inStock,
      // product_image: req.body.product_image,
      // rate_card: req.body.rate_card,
      // quotation: req.body.quotation,
      // brochure: req.body.brochure,
      // service_for: req.body.service_for
    });
    
    // Conditionally add Learning and Development fields
    if (
      req.body.category === 'Learning and Development' &&
      ["Certification Programs", "E-Learning Subscriptions", "Skill Enhancement Courses", "Leadership Training","Professional Development Courses"].includes(req.body.subcategory)
    ) {
      product.learning_and_development = {
        // program_title: req.body.program_title,
        duration: req.body.duration,
        duration_unit: req.body.duration_unit,
        skill_level: req.body.skill_level,
        learning_objectives: req.body.learning_objectives,
        delivery_mode: req.body.delivery_mode,
        certification_type: req.body.certification_type,
        access_duration: req.body.access_duration,
        access_duration_unit: req.body.access_duration_unit,
        support_type: req.body.support_type,
        post_completion_resources: req.body.post_completion_resources,
        cost: req.body.cost,
        currency: req.body.currency,
        enrollment_capacity: req.body.enrollment_capacity,
        languages: req.body.languages,
        instructor_credentials: req.body.instructor_credentials,
        prerequisites: req.body.prerequisites,
        assessment_evaluation: req.body.assessment_evaluation,
        description: req.body.description,
        refund_policy: req.body.refund_policy
      };
    }else if(req.body.category ==="Insurance" && ["Health Insurance","Life Insurance","Motor fleet"].includes( req.body.subcategory)){
      product.insurance = {
        coverage_amount: req.body.coverage_amount,
        premium_cost: req.body.premium_cost,
        policy_term: req.body.policy_term,
        eligibility_criteria: req.body.eligibility_criteria,
        policy_inclusions: req.body.policy_inclusions,
        policy_exclusions: req.body.policy_exclusions,
        waiting_period: req.body.waiting_period,
        claim_process: req.body.claim_process,
        deductible: req.body.deductible,
        co_payment_percentage: req.body.co_payment_percentage,
        renewability_option: req.body.renewability_option,
        network_providers: req.body.network_providers,
        add_ons: req.body.add_ons,
        free_look_period: req.body.free_look_period,
        no_claim_bonus: req.body.no_claim_bonus,
        grace_period: req.body.grace_period,
        policy_document_url: req.body.policy_document_url,
      };
      
    }

    // supplier?.products?.push(product);
    // await supplier?.save();
    await product.save();

    return res.status(201).json({ msg: "Product created successfully.", product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong." });
  }
};


exports.productBulkUpload = async (req, res) => {
  const supplierID = req.params.supplierID;
  const supplierInfo = await Supplier.findById(supplierID);
 
  if (req.error || !req.file.filename) {
    return res.status(500).json({ msg: "Excel file Only" });
  }
  let workbook = xlsx.readFile(`./uploads/${req.file.filename}`);

  const columns = {
    Name: 0,
    Type: 1,
    Category: 2,
    Subcategory: 3,
    Offeredto:4,
    SuitableFor:5

  };

  let sheet = workbook.Sheets[workbook.SheetNames[0]];

  const range = xlsx.utils.decode_range(sheet["!ref"]);
  const extractedData = [];
  let productAll = [];

  for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
    const row = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 0 })];
    if (row) {
      const rowData = {
        product_name:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.Name })]?.w ||
          "",
        product_type:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.Type })]?.w ||
          "",
        category:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.Category })]
            ?.w || "",

        subcategory:
          sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.Subcategory })]
            ?.w || "",
            offered_to:
            sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.Offeredto })]
              ?.w || "",
              service_for:
              sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns.SuitableFor })]
                ?.w || "",
        supplier: supplierInfo,
      };

      extractedData.push(rowData);
    } else {
      console.log("not format");
      fs.unlink(`./uploads/${req.file.filename}`, function (err) {
        if (err) throw err;
        console.log("File deleted!", req.file.filename);
      });
      return res.status(400).json({ msg: "please upload details correctly" });
    }
  }

  const dbdata = await Product.find();


  for (let eachProduct = 0; eachProduct < extractedData.length; eachProduct++) {
    let foundMatch = false;

    if (dbdata.length <= 0) {
      const product = await Product.create(extractedData[eachProduct]);
      productAll.push(product);
    } else {
      for (let i = 0; i < dbdata.length; i++) {
        const existProduct = dbdata[i];

        const dbProductName = existProduct.product_name;
        const excelProductName = extractedData[eachProduct].product_name;
        const dbSupplier = existProduct.supplier.toString();
        const excelSupplier =
          extractedData[eachProduct].supplier._id.toString();

    

        if (
          dbProductName === excelProductName &&
          dbSupplier === excelSupplier
        ) {
          foundMatch = true;
  
          break;
        }
      }

      if (!foundMatch) {
        const product = await Product.create(extractedData[eachProduct]);
        // supplierInfo?.products?.push(product);
        productAll.push(product);
      }
    }
  }

  fs.unlink(`./uploads/${req.file.filename}`, function (err) {
    if (err) throw err;
   
  });
  productAll.length <= 0
    ? res
        .status(302)
        .json({ msg: "No New details to upload or error with excel details" })
    : res
        .status(200)
        .json({ msg: "Product details uploaded successfully", productAll });
};

//get all
exports.getAllProducts = async (req, res) => {
  const id = req.params.id;


  try {
    const product = await Product.find({ supplier: id })
      .sort({ createdAt: -1 })
      .populate("supplier")
      .exec();

    return res.status(200).json({ msg: "Success", product });
  } catch (error) {
   
    return res.status(500).json({ msg: "Something Went Wrong" });
  }
};

// exports.getAllProducts1 = async (req, res) => {
//   let filter = req.query.filter;

//   try {
//     if (filter) {
//       if (filter === "All") {
//         const product = await Product.find().populate("supplier").exec();
//         return res
//           .status(201)
//           .json({ msg: "All Products get Successfully", product });
//       } else {
//         const product = await Product.find({ admin_approval: filter })
//           .populate("supplier")
//           .exec();

//         return res.status(200).json({ msg: "Success", product });
//       }
//     } else {
//       const product = await Product.find().populate("supplier").exec();

//       return res.status(200).json({ msg: "Success", product });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ msg: "Something Went Wrong" });
//   }
// };

//get one

exports.getAllProducts1 = async (req, res) => {
  let filter = req.query.filter;

  try {
    let productQuery;

    if (filter) {
      if (filter === "All") {
        // Sort products by createdAt in descending order
        productQuery = Product.find().populate("supplier").sort({ createdAt: -1 }).exec();
      } else {
        // Filter products based on admin_approval and sort by createdAt
        productQuery = Product.find({ admin_approval: filter })
          .populate("supplier")
          .sort({ createdAt: -1 })
          .exec();
      }
    } else {
      // No filter, just fetch all products and sort by createdAt
      productQuery = Product.find().populate("supplier").sort({ createdAt: -1 }).exec();
    }

    const product = await productQuery;

    return res.status(200).json({ msg: "Success", product });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Something Went Wrong" });
  }
};



exports.getOneProduct = async (req, res) => {
 
  try {
    const product = await Product.findById(req.params.id)
      .populate("supplier")
      .exec();
    res.status(201).json({ msg: "Successfully fetched one product", product });
  } catch (error) {

    res.status(401).json({ err: "Something went wrong !", error });
  }
};

//update
//Working  update old one
// exports.updateProduct = async (req, res) => {
//   console.log("my req body for update is",req.body);

//   try {
//     const product = await Product.findById(req.params.id);

//     await Product.updateOne({ _id: req.params.id }, req.body);

//     console.log("product is and ",product);

//     await product.save();

//     res.status(201).json({ msg: "Product Updated Successfully", product });
//   } catch (error) {
//     console.log(error);
//     res.status(401).json({ msg: "Something went wrong !", error });
//   }
// };

exports.updateProduct = async (req, res) => {
  try {
    // Fetch the existing product to preserve existing `learning_and_development` data
    const existingProduct = await Product.findById(req.params.id);

    if (!existingProduct) {
      return res.status(404).json({ msg: "Product not found!" });
    }

    // Prepare update data, preserving existing `learning_and_development` and `insurance` fields if not provided in req.body
    const updateData = {
      ...req.body,
      learning_and_development: {
        ...(existingProduct.learning_and_development ? existingProduct.learning_and_development.toObject() : {}),
        ...(req.body.category === 'Learning and Development' 
          && 
          ["Certification Programs", "E-Learning Subscriptions", "Skill Enhancement Courses", "Leadership Training", "Professional Development Courses"].includes(req.body.subcategory) 
          ? req.body
          : {}
        )
      },
      insurance: {
        ...(existingProduct.insurance ? existingProduct.insurance.toObject() : {}),
        ...(req.body.category === 'Insurance' && 
          ["Health Insurance", "Life Insurance", "Motor fleet"].includes(req.body.subcategory) 
          ? req.body
          : {})
      }
    };

    // Perform the update
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({ msg: "Product Updated Successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ msg: "Something went wrong!", error });
  }
};







//delete
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete({ _id: req.params.id });

    res.status(201).json({ msg: "Deleted Successfully", product });
  } catch (error) {
    res.status(401).json({ err: "Something went wrong !", error });
  }
};
