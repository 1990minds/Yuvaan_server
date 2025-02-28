const crypto = require("crypto");
const getEmployeeUAEModel = require("../model/employeeUAE");
const xlsx = require("xlsx");
const fs = require("fs");
const sgMail = require('@sendgrid/mail');
const MarketplacePro = require("../model/marketPlace");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');


function generateSecureRandomPassword() {
  const passwordLength = 12
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numericChars = '0123456789';
  const specialChars = '!@#$&';
  const allChars = lowercaseChars + uppercaseChars + numericChars + specialChars

  const randomBytes = crypto.randomBytes(passwordLength)

  const password = Array.from(randomBytes).map(byte => allChars[byte % allChars.length]).join('')

  return password
}


const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "64h"
  })
}


exports.employeeUAEBulkUpload = async (req, res) => {
  const tenantID = req.params.tenantID;


  // Fetch the employee model for the specific tenant
  const employeesData = await getEmployeeUAEModel(tenantID);


  // Checking if there's an error in the request or if no file is uploaded
  if (req.error || !req.file.filename) {
    return res.status(500).json({ msg: "Excel file only" });
  }

  // Reading the uploaded Excel file
  let workbook = xlsx.readFile(`./uploads/${req.file?.filename}`);

  // Defining columns mapping for employee data
  const columns = {
    employeeCode: 0,
    employeeName: 1,
    gender: 2,
    dateofBirth: 3,
    dateofJoining: 4,
    position: 5,
    currentSalary: 6,
    currentManager: 7,
    department: 8,
    country: 9,
    officeLocation: 10,
    employeeNationality: 11,
    employeeResidence: 12,
    email: 13,
    phone: 14,
  };


  // Extracting data from the first sheet of the workbook
  let sheet = workbook.Sheets[workbook.SheetNames[0]];

  // Decoding the range of the sheet
  const range = xlsx.utils.decode_range(sheet["!ref"]);

  // Array to store extracted employee data
  const extractedData = [];
  let employeeAll = [];

  // Looping through each row of the sheet to extract employee data
  for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
    const row = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 0 })];
    if (row) {
      const rowData = {
        employeeCode: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.employeeCode })]?.w || "",
        employeeName: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.employeeName })]?.w || "",
        gender: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.gender })]?.w || "",
        dateofBirth: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.dateofBirth })]?.w || "",
        dateofJoining: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.dateofJoining })]?.w || "",
        position: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.position })]?.w || "",
        employee_nationality: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.employeeNationality })]?.w || "",
        currentSalary: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.currentSalary })]?.w || "",
        currentManager: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.currentManager })]?.w || "",
        department: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.department })]?.w || "",
        country: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.country })]?.w || "",
        officeLocation: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.officeLocation })]?.w || "",
        employeeResidence: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.employeeResidence })]?.w || "",
        email: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.email })]?.w || "",
        phone: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.phone })]?.w || "",
        tenant_id: tenantID,
        password: ""
      };


      extractedData?.push(rowData);
    }
  }



  // Fetching existing employee data from the database
  const dbdata = await employeesData.find();


  // Looping through extracted employee data and processing each entry
  for (let eachEmployee = 0; eachEmployee < extractedData.length; eachEmployee++) {
    let foundMatch = false;
    for (let i = 0; i < dbdata.length; i++) {
      const existEmployee = dbdata[i];

      const dbEmployeeemployeeCode = existEmployee.employeeCode;
      const excelEmployeeemployeeCode = extractedData[eachEmployee]?.employeeCode;

      if (dbEmployeeemployeeCode === excelEmployeeemployeeCode) {
        foundMatch = true;
        await employeesData.updateOne(
          { employeeCode: dbEmployeeemployeeCode },
          extractedData[eachEmployee]
        );
        break;
      }
    }

    if (!foundMatch) {

      // Sending welcome email via SendGrid
      const rowData = extractedData[eachEmployee]; // Get the current employee's data
      const username = rowData.email;
      const password = generateSecureRandomPassword();
  
      const salt = await bcrypt.genSalt(10);
      rowData.password = await bcrypt.hash(password, salt);;

      const employeeData = await employeesData.create(extractedData[eachEmployee]);
      employeeAll.push(employeeData);

      try {
        sgMail.setApiKey(process?.env?.SENDGRID_API_KEY);
        const msg = {
          to: rowData.email,  // Correctly using rowData.email instead of req.body.email
          from: "corporate.solutions@rjac.co.in", // Your verified sender email
          subject: "Welcome to Total Connect - Your Employer Marketplace Solution!",
          html: `<p>Dear <b>${rowData.employeeName},</b></p>
               <p>Welcome to Total Connect, your complete employer marketplace solution!</p>
               <p>We're excited to have you onboarded with us. Your account has been successfully created, and below are your login credentials:</p>
               <p>- Click here to login: <a href="https://total-connect-employer.web.app/">Total Connect Employer</a></p> 
               <p>- Username: <b>${username}</b></p>
               <p>- Password: <b>${password}</b></p>
               <p>Please log in to your account and begin adding your products. If you have any questions or need assistance, feel free to reach out to our support team at contact@totalconnect.com.</p>
               <p>Thank you for choosing Total Connect. We look forward to serving you!</p>
               <br/>
               <p>Best regards,</p>
               <p>The Total Connect Team</p>`
        };
        await sgMail.send(msg);
      
      } catch (error) {
        console.error(`Error sending email to ${rowData.email}:`, error);
      }
    }
  }

  // Identify and delete employees that are in the database but not in the uploaded file
  const extractedEmployeeCodes = extractedData.map(emp => emp.employeeCode);
  const employeesToDelete = dbdata.filter(dbEmp => !extractedEmployeeCodes.includes(dbEmp.employeeCode));

  for (const emp of employeesToDelete) {
    await employeesData.deleteOne({ employeeCode: emp.employeeCode });
 
  }

  // Delete the uploaded file after processing
  fs.unlink(`./uploads/${req.file.filename}`, function (err) {
    if (err) throw err;
  });

  // Sending response based on whether new employees were uploaded or not
  employeeAll.length <= 0 ?
    res.status(302).json({ msg: "No new details to upload" }) :
    res.status(200).json({ msg: "Employee details uploaded successfully", employeeAll });
};


exports.getAllEmployeesUAE = async (req, res) => {
  try {
    const tenantId = req.params.tenantID;

    const Employee = await getEmployeeUAEModel(tenantId);
    const employees = await Employee.find();

    return res.status(200).json({ msg: "Success", employees });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to fetch employees" });
  }
};


exports.getEmployeeById = async (req, res) => {

  try {
    const tenantId = req.params.tenantID;
    const employeeId = req.params.employeeID;

    const Employee = await getEmployeeUAEModel(employeeId);
    const employee = await Employee.findById(tenantId).populate({
      path: 'marketplace',
      populate: {
        path: 'product' 
      }
    })
      .exec();

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    return res.status(200).json({ msg: "Success", employee });
  } catch (error) {

    return res.status(500).json({ msg: "Failed to fetch employee" });
  }
};

exports.updateEmployeeRewards = async (req, res) => {
  console.log("Employer API Request Body:", req.body);
  try {
    const tenantId = req.params.tenantID;
    const employeeId = req.params.employeeID;
    let { rewardPoints } = req.body;

    // Ensure rewardPoints is a valid number
    rewardPoints = Number(rewardPoints) || 0;

    const Employee = await getEmployeeUAEModel(tenantId);
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // Check if the new reward points are greater than the existing value
    const isIncrease = rewardPoints > (employee.rewardPoints || 0);

    // Directly update the reward points
    employee.rewardPoints = rewardPoints;
    employee.rewardsIncrease = isIncrease; // Set to true if new value is greater

    await employee.save();

    console.log("Updated reward points:", employee.rewardPoints, "Rewards Increased:", employee.rewardsIncrease);

    return res.status(200).json({
      msg: "Employee rewards updated successfully by Employer",
      employee,
    });
  } catch (error) {
    console.error("Failed to update employee rewards by Employer:", error);
    return res.status(500).json({ msg: "Failed to update employee rewards" });
  }
};


exports.useEmployeeRewards = async (req, res) => {
  console.log("Employee API Request Body:", req.body);
  try {
    const tenantId = req.params.tenantID;
    const employeeId = req.params.employeeID;
    let { rewardPoints } = req.body;

    // Ensure rewardPoints is a valid number
    rewardPoints = Number(rewardPoints) || 0;

    const Employee = await getEmployeeUAEModel(tenantId);
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // Initialize reward points if not set
    employee.rewardPoints = employee.rewardPoints || 0;


    // Deduct reward points for purchase
    employee.rewardPoints -= rewardPoints;

    await employee.save();

    console.log("Remaining reward points:", employee.rewardPoints);

    return res.status(200).json({
      msg: "Employee rewards used successfully",
      employee,
    });
  } catch (error) {
    console.error("Failed to use employee rewards:", error);
    return res.status(500).json({ msg: "Failed to use employee rewards" });
  }
};






exports.updateEmployeeRecommendedProducts = async (req, res) => {
  try {
    const tenantId = req.params.tenantID; // Tenant ID from request parameters
    const employeeId = req.params.employeeID; // Employee ID from request parameters
    const { marketplace, firstTimeLogin } = req.body; // New marketplace ObjectId array and firstTimeLogin field from request body

    // Check if marketplace array is provided and is an array
    if (marketplace && !Array.isArray(marketplace)) {
      return res.status(400).json({ msg: "Marketplace IDs should be provided as an array" });
    }

    // Convert marketplace IDs to ObjectId if provided
    const marketplaceObjectIds = marketplace ? marketplace.map(id => new mongoose.Types.ObjectId(id)) : [];

    // Retrieve tenant-specific Marketplace model
    const Marketplace = await MarketplacePro(tenantId);

    // Validate each marketplace ID if marketplace is provided
    if (marketplace) {
      const validMarketplaces = await Marketplace.find({ _id: { $in: marketplaceObjectIds } });
      if (validMarketplaces.length !== marketplace.length) {
        return res.status(400).json({ msg: "One or more Marketplace IDs do not exist" });
      }
    }

    // Retrieve the employee model for the specific tenant
    const Employee = await getEmployeeUAEModel(tenantId);
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // Update the employee's marketplace and firstTimeLogin fields if provided
    if (marketplace) {
      employee.marketplace = marketplaceObjectIds;
    }

    if (typeof firstTimeLogin === 'boolean') {
      employee.firstTimeLogin = firstTimeLogin;
    }

    // Save the updated employee data
    await employee.save();

    return res.status(200).json({
      msg: "Employee marketplace and firstTimeLogin updated successfully",
      employee,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to update employee marketplace and firstTimeLogin" });
  }
};


exports.updateEmployeeSkills = async (req, res) => {
  try {
    const tenantId = req.params.tenantID;
    const employeeId = req.params.employeeID;
    const { skills } = req.body;

    // Validate skills input
    if (!Array.isArray(skills)) {
      return res.status(400).json({ msg: "Skills must be an array" });
    }

    // Get the tenant-specific employee model
    const Employee = await getEmployeeUAEModel(tenantId);
    if (!Employee) {
      return res.status(404).json({ msg: "Employee model not found for tenant" });
    }

    // Find the employee by ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // Overwrite the employee's skills with the new skills
    employee.empSkills = skills;

    // Save the updated employee data
    const savedEmployee = await employee.save();
    if (!savedEmployee) {
      return res.status(500).json({ msg: "Failed to save updated skills" });
    };

    return res.status(200).json({
      msg: "Employee skills updated successfully",
      employee: savedEmployee,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to update employee skills" });
  }
};

exports.updateEmployeeVehicleDetails = async (req, res) => {
  try {
    const tenantId = req.params.tenantID;
    const employeeId = req.params.employeeID;
    const { vehicle_type, vehicle_no, prev_insurance,expireDate } = req.body;

    // Get the tenant-specific employee model
    const Employee = await getEmployeeUAEModel(tenantId);

    // Find the employee by ID
    const employee = await Employee.findById(employeeId);

    if (!employee) return res.status(404).json({ msg: "Employee not found" });

    // Add new vehicle details as a new entry in the empVehicleDetails array
    employee.empVehicleDetails.push({ vehicle_type, vehicle_no, prev_insurance,expireDate });
    
    // Save the updated employee data
    await employee.save();

    return res.status(200).json({
      msg: "Employee vehicle details updated successfully",
      employee,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to update employee vehicle details" });
  }
};

exports.updateEmployeeVehicleDetailsParicular = async (req, res) => {

  try {
    
    const employeeId = req.params.employeeID;
    const vehicleId = req.params.vehicleID; // ID of the specific vehicle to update
    const { vehicle_type, vehicle_no, prev_insurance, expireDate } = req.body;

    // Get the tenant-specific employee model
    const Employee = await getEmployeeUAEModel(tenantId);

    // Find the employee by ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // Find the vehicle detail by vehicle ID
    const vehicleDetail = employee.empVehicleDetails.id(vehicleId);
    if (!vehicleDetail) {
      return res.status(404).json({ msg: "Vehicle detail not found" });
    }

    // Update the vehicle details
    vehicleDetail.vehicle_type = vehicle_type || vehicleDetail.vehicle_type;
    vehicleDetail.vehicle_no = vehicle_no || vehicleDetail.vehicle_no;
    vehicleDetail.prev_insurance = prev_insurance !== undefined ? prev_insurance : vehicleDetail.prev_insurance;
    vehicleDetail.expireDate = expireDate || vehicleDetail.expireDate;

    // Save the updated employee data
    await employee.save();

    return res.status(200).json({
      msg: "Vehicle details updated successfully",
      employee,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to update vehicle details" });
  }
};

exports.login = async (req, res) => {
  const { email, password, tenantID } = req.body;

  try {
    const Employee = await getEmployeeUAEModel(tenantID);

    // Find the employee by email
    const employee = await Employee.findOne({ email: email });

    if (!employee) {
      return res.status(404).json({ msg: 'Invalid User' });
    }
    
console.log(employee.password)
    // Compare the provided password with the employee's hashed password
    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

 

    // Create token using the employee's ID
    const token = createToken(employee._id);
    res.status(201).json({ msg: "Logged-in Successfully", token, employee });
  } catch (e) {
    res.status(401).json({ err: "Something went wrong!", e });
  }
};








