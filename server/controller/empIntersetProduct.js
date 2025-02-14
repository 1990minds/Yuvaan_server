const empInterestPro = require("../model/empIntersetProduct");

exports.createEmpIntPro = async (req, res) => {
  try {
    const { employeeId, productId, supplierId, health_insurance,motor_insurance,life_insurance,claimsData } = req.body;

    // Check if the employee has already shown interest in the product for this supplier
    const existingInterest = await empInterestPro.findOne({
      product: productId,
      supplier: supplierId,
      "employee.employeeId": employeeId?._id // Checking by employeeId from the request
    });

    if (existingInterest) {
      return res.status(409).json({
        message: "Employee has already shown interest in this product"
      });
    }

    // Create the record if no existing interest
    const newInterest = new empInterestPro({
      employee: {
        employeeId: employeeId?._id || null,
        employeeCode: employeeId?.employeeCode,
        employeeName: employeeId?.employeeName,
        gender: employeeId?.gender,
        dateofBirth: employeeId?.dateofBirth,
        dateofJoining: employeeId?.dateofJoining,
        position: employeeId?.position,
        currentSalary: employeeId?.currentSalary,
        email: employeeId?.email,
        phone: employeeId?.phone,
        tenant_id: employeeId?.tenant_id,
        rewardPoints: employeeId?.rewardPoints,
      },
      product: productId,
      supplier: supplierId,
      insurance_Details: {
        health_insurance: {
          who_to_insure: {
            self: health_insurance?.self,
            spouse: health_insurance?.spouse,
            son: health_insurance?.son,
            son_count: health_insurance?.son_count,
            daughter: health_insurance?.daughter,
            daughter_count: health_insurance?.daughter_count,

          },
          son_count: health_insurance?.son_count,
          daughter_count: health_insurance?.daughter_count,
          cover_amount: health_insurance?.cover_amount,
          full_name: health_insurance?.full_name,
          age: health_insurance?.age,
          gender: health_insurance?.gender,
          mobile_number: health_insurance?.mobile_number,
        },
        motor_insurance: {
        vehicle_no: motor_insurance?.vehicle_no,
        prev_policy: motor_insurance?.prev_policy,
        any_cliams_prev: motor_insurance?.any_cliams_prev,
        full_name_motor: motor_insurance?.full_name_motor,
        mobile_number_motor: motor_insurance?.mobile_number_motor,
        },
        life_insurance: {
          full_name_life: life_insurance?.full_name_life,
          gender_life: life_insurance?.gender_life,
          age_life: life_insurance?.age_life,
          mobile_number_life: life_insurance?.mobile_number_life,
          anual_income_life: life_insurance?.anual_income_life,
          cover_amount_life: life_insurance?.cover_amount_life,
          smoke_status_life: life_insurance?.smoke_status_life,
          },
      },
    });

    const savedInterest = await newInterest.save();

    res.status(201).json({
      message: "Interest submitted successfully!",
      data: savedInterest,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};





exports.getAllEmpIntPro = async (req, res) => {
  const supplierID = req.params.supId;
  try {


    // Fetch employee interest products sorted by creation date and populated with employee and product details
    const empIntproBySup = await empInterestPro
      .find({ supplier: supplierID })
      .sort({ createdAt: -1 })
      .populate("product");
    return res.status(200).json({ msg: "Success", empIntproBySup });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};


exports.getEmpIntProByEmpId = async (req, res) => {
  try {
    const { id } = req.params; // Fixed the destructuring error

    // Find interest records where the employeeId matches the provided id
    const interests = await empInterestPro.find({ "employee.employeeId": id }).populate("product");

    if (interests.length === 0) {
      return res.status(404).json({ message: "No employee interest in products found for this employee" });
    }

    res.status(200).json({
      message: "Employee interests in products fetched successfully",
      data: interests
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};



exports.getEmpIntProByProductId = async (req, res) => {
  try {
    const { id } = req.params;
   

    // Find interest records where the product matches the provided id
    const interests = await empInterestPro.find({ _id: id }).populate("product");
    if (interests.length === 0) {
      return res.status(404).json({ message: "No employee interest in products found for this product" });
    }

    res.status(200).json({
      message: "Employee interests in products fetched successfully",
      data: interests
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};



exports.deleteEmpIntPro = async (req, res) => {
  try {
    const { tenantId, id } = req.params;

    const empInterestProModel = await getEmpInterestPro(tenantId);

    // Find and delete the interest record
    const deletedInterest = await empInterestProModel.findByIdAndDelete(id);

    if (!deletedInterest) {
      return res.status(404).json({ message: "Employee interest in product not found" });
    }

    res.status(200).json({
      message: "Employee interest in product deleted successfully"
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.updateInterestProductStatus = async (req, res) => {
  try {
    // Find the product by ID
    const product = await empInterestPro.findById(req.params.id);

    // Check if the product exists
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Update the empProStatus field
    product.empProStatus = req.body.empProStatus || product.empProStatus;

    // Save the updated product
    await product.save();

    res.status(200).json({ msg: "Product status updated successfully", product });
  } catch (error) {

    res.status(500).json({ msg: "Something went wrong!", error });
  }
};





