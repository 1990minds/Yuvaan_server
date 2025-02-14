const connectDB = require('../../config/db');
const getEmployerModel = require("../model/employer");
const getEmployeeModel = require('../model/employees')
const getRewardModel = require('../model/rewards')
const getEmployerOrderModel = require('../model/employerOrders')
const getMarketPlaceModel = require('../model/marketPlace')
const sgMail = require('@sendgrid/mail');

const mongoose = require("mongoose");

const { MongoClient } = require("mongodb");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Employee = require('./employees')


const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "64h"
  })
}

function generateSecureRandomPadding(length) {
  return crypto.randomBytes(length).toString('hex').toUpperCase()
}

function generateCustomUUID(prefix) {
  const securePadding = generateSecureRandomPadding(3)
  const customUUID = `${prefix}${securePadding}`
  return customUUID
}

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

//tennatid

function generateSecureRandomPadding(length) {
  return crypto.randomBytes(length).toString('hex').toUpperCase();
}
function generateCustomTenantId(prefix) {
  const securePadding = generateSecureRandomPadding(3);
  const customUUID = `${prefix}${securePadding}`
  return customUUID;
}

//create
exports.createEmployer = async (req, res) => {
  console.log(req.body)
  const { email } = req.body
  let employerID = ""

  const comp = req.body?.employer_name;
  const x = comp.split('');
  const filteredChars = x.filter((char) => char !== ' ');
  const compName = filteredChars.slice(0, 4).join('').toUpperCase();
  console.log(compName);

  let Tenant = generateCustomTenantId(compName)
  try {
    await connectDB();
    const Employer = await getEmployerModel();


    const existEmployer = await Employer.findOne({ email: req.body.email })
    if (existEmployer) {
      return res.status(401).json({ msg: "Email already exists!" });

    }


    const Employee = await getEmployeeModel(Tenant)
    const Reward = await getRewardModel(Tenant)
    const EmployerOrder = await getEmployerOrderModel(Tenant)
    const MarketPlace = await getMarketPlaceModel(Tenant)

    const a = await Employer.countDocuments();
    for (let i = 1; i <= a + 1; i++) {
      employerID = generateCustomUUID("TCEM", i);

      const existingEmployer = await Employer.findOne({
        employer_id: employerID,
      });

      if (!existingEmployer) {
        break;
      }
    }
    const generatedPassword = generateSecureRandomPassword();
    console.log("employer id", employerID);


    console.log("employer password", generatedPassword);

    const employer = new Employer({
      ...req.body,
      employer_id: employerID,
      password: generatedPassword,
      tenant_id: Tenant
    });
    employer.email = email.toLowerCase();

    const salt = await bcrypt.genSalt(10);
    employer.password = await bcrypt.hash(employer.password, salt);

    await employer.save();
    sgMail.setApiKey(process?.env?.SENDGRID_API_KEY)
    const msg = {
      to: req?.body?.email,
      // cc: "1990moffice@gmail.com",
      from: "corporate.solutions@rjac.co.in",
      subject: "Welcome to Yuvaan Wellness - Your Employer Marketplace Solution!",
      html: `<p>Dear <b>${req?.body?.employer_name},</b></p>
              <p>Welcome to Yuvaan Wellness, your complete employer marketplace solution!</p>
              
              <p>We're excited to have you onboarded with us. Your account has been successfully created, and below are your login credentials :</p>
              <p>- Click here to login : <a href="https://total-connect-employer.web.app/">Yuvaan Wellness Employer</a></P> 
              <p>- Username : <b>${employerID}</b></P>
               <p>- Password : <b>${generatedPassword}</b></P>
               <p>Please log in to your account.If you have any questions or need assistance, feel free to reach out to our support team at contact@yuvaan.com</P>
               <p>Thank you for choosing Yuvaan Wellness. We look forward to serving you!</p>
               <br/>
               <p>Best regards,</p>
               <p>The Yuvaan Team</p>
        
        `,
    };
    await sgMail.send(msg);
    res
      .status(200)
      .json({ msg: "Employer Registered Successfully", employer });
    return Employee(), Reward(), EmployerOrder(), MarketPlace()

  } catch (error) {
    console.log(error)
    return res.status(501).json({ err: "Something went wrong !", error });
  }
}

//get all

exports.getAllEmployers = async (req, res) => {
  try {
    const Employer = await getEmployerModel();

    const employer = await Employer.find().sort({ createdAt: -1 });
    res
      .status(200)
      .json({ msg: "Successfully fetched all employers", employer });
  } catch (error) {
    res.status(404).json({ msg: "Employers Not Found" });
  }
};


//get One

exports.getOneEmployer = async (req, res) => {
  try {
    const Employer = await getEmployerModel();
    const employer = await Employer.findById(req.params.id)
    res.status(201).json({ msg: "Successfully fetched one employer", employer });
  } catch (error) {
    console.log(error);
    res.status(401).json({ err: "Something went wrong !", error });
  }
};

//update
exports.updateEmployer = async (req, res) => {
  console.log("-->",req.body)
  const { password } = req.body;
  try {
    const Employer = await getEmployerModel();

    const employer = await Employer.findById(req.params.id);

    //   console.log(req.body.password);
    if (req.body.password) {
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(401).json({
          msg: "Password should be at least 8 characters with one uppercase letter and special symbols without spaces",
        });
      }
      else {
        const salt = await bcrypt.genSalt(10);
        employer.password = await bcrypt.hash(req.body.password, salt);
      }
    }

    await Employer.updateOne({ _id: req.params.id }, req.body);

    await employer.save();

    res.status(201).json({ msg: "Employer Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Something went wrong !", error });
  }
};


exports.getEmployernotauth = async (req, res) => {

  try {
    const Employer = await getEmployerModel();

    const employer = await Employer.findById(req.params.id);

    res.status(201).json({ msg: "Employer get Successfully",employer });
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: "Something went wrong !", error });
  }
};


exports.updateEmployerTour = async (req, res) => {
  console.log("-->", req.body); // Log the request body to see which keys are sent
  try {
    const Employer = await getEmployerModel();

    // Update only the fields provided in req.body
    const updatedEmployer = await Employer.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true, runValidators: true } // Options to return updated document and run validation
    );

    if (!updatedEmployer) {
      return res.status(404).json({ msg: "Employer not found" });
    }

    res.status(201).json({ msg: "Employer Updated Successfully", updatedEmployer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong!", error });
  }
};


exports.deleteEmployer = async (req, res) => {
  try {
    const Employer = await getEmployerModel();
    const tenantId = req.body.tenant_id;

    // Delete employer
    await Employer.findOneAndDelete({ _id: req.params.id });

    // Delete all associated data across collections for the specific tenant ID
    await deleteTenantData(tenantId);

    res.status(201).json({ msg: "Employer and associated tenant data deleted successfully" });
  } catch (error) {
    res.status(401).json({ err: "Something went wrong!", error });
  }
};

// Function to delete all associated data for a given tenant ID
const deleteTenantData = async (tenantId) => {
  try {
    const Employee = await getEmployeeModel(tenantId);
    const Reward = await getRewardModel(tenantId);
    const EmployerOrder = await getEmployerOrderModel(tenantId);
    const MarketPlace = await getMarketPlaceModel(tenantId);

    await Employee.deleteMany({ tenant_id: tenantId });
    await Reward.deleteMany({ tenant_id: tenantId });
    await EmployerOrder.deleteMany({ tenant_id: tenantId });
    await MarketPlace.deleteMany({ tenant_id: tenantId });

  } catch (error) {
  
    throw error;
  }
};

//login

exports.login = async (req, res) => {
  const { employer_id, password } = req.body

  try {
    const Employer = await getEmployerModel()
    const employer = await Employer.findOne({ employer_id: employer_id })
    if (!employer) {
      return res.status(400).json({ msg: "Invalid User" });

    }
    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }
    const token = createToken(employer._id);
    res.status(201).json({ msg: "Logged-in Successfully", token, employer });
  }
  catch (error) {
    console.log(error);
    res.status(401).json({ err: "Something went wrong !", error });
  }
}


//authenticate

exports.isAuthenticateEmployer = async (req, res, next) => {

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const Employer = await getEmployerModel();
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.employer = await Employer.findById(decoded.id).select("-password");
      if (req.employer) {
        next();
      }
      else {

        return res.status(403).json({ msg: "Unauthorized Access" });
      }
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  } else {
    return res.status(403).json({ msg: "Unauthorized Access" });
  }
};


//supplier profile

exports.employerProfile = async (req, res) => {
  try {
    const Employer = await getEmployerModel();

    const employer = await Employer.findById(req.employer._id).select(
      "-password"
    );
    if (!employer) {
      return res.status(401).json({ json: "No Authorization" });
    }
    return res.status(200).json(employer);
  } catch (error) {
    console.log(error);
    return res.status(501).json({ msg: "Something went wrong" });
  }
};



//Get all Suppliers Employers

exports.getAllSupEmployers = async (req, res) => {
 
  try {
    // Assuming supplierID comes from request body
    const { supplierID } = req.body;

    const Employer = await getEmployerModel();

    // Query to find employers based on supplierID
    const employer = await Employer.find({ supplier: supplierID }).sort({ createdAt: -1 });

    // If no employer is found, return a message
    if (!employer.length) {
      return res.status(404).json({ msg: "No employers found for the given supplier" });
    }

    res.status(200).json({ msg: "Successfully fetched employers for the supplier", employer });
  } catch (error) {
  
    res.status(500).json({ msg: "An error occurred while fetching employers" });
  }
};

