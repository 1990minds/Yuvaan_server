const Supplier = require("../model/supplier");
const Products = require("../model/product");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sgMail = require('@sendgrid/mail');


const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "64h",
  });
};

function generateSecureRandomPadding(length) {
  return crypto.randomBytes(length).toString("hex").toUpperCase();
}
function generateCustomUUID(prefix) {
  const securePadding = generateSecureRandomPadding(3);
  const customUUID = `${prefix}${securePadding}`;

  return customUUID;
}



function generateSecureRandomPassword() {
    const passwordLength = 12;
  
   
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numericChars = '0123456789';
    const specialChars = '!@#$&';
  
    
    const allChars = lowercaseChars + uppercaseChars + numericChars + specialChars;
  
  
    const randomBytes = crypto.randomBytes(passwordLength);
  
    // Map each byte to an index in the character set and concatenate
    const password = Array.from(randomBytes).map(byte => allChars[byte % allChars.length]).join('');
  
    return password;
  }


  

exports.createSupplier = async (req, res) => {
 
  const { email, password } = req.body;
  let supplierID = "";
  try {
    const exisupplier = await Supplier.findOne({ email: req.body.email });
    if (exisupplier) {
      return res.status(401).json({ msg: "Email already exists!" });
    }

    const a = await Supplier.countDocuments();

    for (let i = 1; i <= a + 1; i++) {
      supplierID = generateCustomUUID("TCSU", i);

      const existingSupplier = await Supplier.findOne({
        supplier_id: supplierID,
      });

      if (!existingSupplier) {
        break;
      }
    }
    const generatedPassword = generateSecureRandomPassword();
  

    const supplier = new Supplier({
      ...req.body,
      supplier_id: supplierID,
      password: generatedPassword,
    });
   
    supplier.email = email.toLowerCase();

    const salt = await bcrypt.genSalt(10);
    supplier.password = await bcrypt.hash(supplier?.password, salt);

    await supplier.save();
    sgMail.setApiKey(process?.env?.SENDGRID_API_KEY)
    const msg = {
      to: req?.body?.email,
      // cc: "1990moffice@gmail.com",
      from: "corporate.solutions@rjac.co.in",
      subject: "Welcome to Yuvaan Wellness - Vendor Onboarding Complete",
      html: `<p>Dear <b>${req?.body?.supplier_name},</b></p>
            <p>Welcome to Yuvaan Wellness! We're thrilled to have you on board as a Vendor.</p>
            <p>Your onboarding process is now complete. Here are your login credentials:</p>
            <p>- Click here to login : <a href="https://total-connect-supplier.web.app/">Yuvaan Wellness Vendor</a></P> 
             
            <p>- Username: <b>${supplierID}</b></P>
             <p>- Password: <b>${generatedPassword}</b></P>
             <p>Please log in to your account. If you have any questions or need assistance, feel free to reach out to our support team at contact@yuvaanwellness.com</P>
             <p>We're excited to see as part of yuvaan wellness team and look forward to a successful partnership!</p>
             <br/>
             <p>Best regards,</p>
             <p>The Yuvaan Team</p>
      
      `,
    };
    await sgMail.send(msg);

    return res
      .status(200)
      .json({ msg: "Vendor Registered Successfully", supplier });
  } catch (error) {
    
    return res.status(501).json({ err: "Something went wrong !", error });
  }
};

//get all

exports.getAllSupplier = async (req, res) => {
 
  try {

    const supplier = await Supplier.find()
  .sort({createdAt : -1})
    .populate('products')
    .populate('category_Subcategory')
    .exec();
    
    res
      .status(200)
      .json({ msg: "Successfully fetched all suppliers", supplier });
 
  } catch (error) {
    console.log(error);
    res.status(404).json({ msg: "Suppliers Not Found" });
  }
};

//get One

exports.getOneSupplier = async (req, res) => {

  try {
    const supplier = await Supplier.findById(req.params?.id)
    .populate('products')
    .populate('category_Subcategory')
    
    .exec();
    res
      .status(201)
      .json({ msg: "Successfully fetched one supplier", supplier });
  } catch (error) {
    
    res.status(401).json({ err: "Something went wrong !", error });
  }
};

//update admin
exports.updateSupplier = async (req, res) => {
  
  const { password } = req.body;
  try {
    

    const supplier = await Supplier.findById(req.params.id);

    if (req.body.password) {

      const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(401).json({
        msg: "Password should be at least 8 characters with one uppercase letter and special symbols without spaces",
      });
    }else{
      const salt = await bcrypt.genSalt(10);
      supplier.password = await bcrypt.hash(req.body.password, salt);
    }}

    await Supplier.updateOne({ _id: req.params.id }, req.body);
    await supplier.save();

    res.status(201).json({ msg: "Supplier Updated Successfully" });
  } catch (error) {
   
    res.status(401).json({ msg: "Something went wrong !", error });
  }
};


exports.updateSupplierTour = async (req, res) => {
  console.log("-->", req.body); // Log the request body to see which keys are sent
  try {
    
    // Update only the fields provided in req.body
    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id, 
      { $set: req.body }, 
      { new: true, runValidators: true } 
    );

    if (!updatedSupplier) {
      return res.status(404).json({ msg: "Employer not found" });
    }

    res.status(201).json({ msg: "Employer Updated Successfully", updatedSupplier });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong!", error });
  }
};

//delete
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findByIdAndDelete({ _id: req.params.id });
    if(supplier){
      const products = await Products.deleteMany({supplier:supplier?._id})
    
    }

    res.status(201).json({ msg: "Supplier deleted Successfully", supplier });
  } catch (error) {
    res.status(401).json({ err: "Something went wrong !", error });
  }
};

//supplier login

exports.login = async (req, res) => {
  const { supplier_id, password } = req.body;
  try {
    const supplier = await Supplier.findOne({ supplier_id: supplier_id });
    if (!supplier) {
      return res.status(400).json({ msg: "Invalid User" });
    }
    const isMatch = await bcrypt.compare(password, supplier.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }
    const token = createToken(supplier._id);

    if (!token) {
      return res.status(500).json({ msg: "Token creation failed" });
    }
    res.status(201).json({ msg: "Logged-in Successfully", token, supplier });
  } catch (error) {
    
    res.status(401).json({ err: "Something went wrong !", error });
  }
};

//authenticate

exports.isAuthenticateSupplier = async (req, res, next) => {
  // console.log("Incoming request headers:", req.headers);

  const authHeader = req.headers.authorization;
  // console.log("Authorization header:", authHeader);
  if (
    authHeader &&
    authHeader.startsWith("Bearer")
  ) {
    try {
      let token = req.headers.authorization.split(" ")[1];
      // console.log("Token extracted from header:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Decoded token:", decoded);
      
      if (!decoded.id) {
        return res.status(401).json({ error: "Invalid Token" });
      }
      req.supplier = await Supplier.findById(decoded?.id).select("-password");
      // console.log("supplier details from database:", req.supplier);
      if (!req.supplier) {
        // console.log("Supplier not found in database.");
        return res.status(401).json({ error: "Supplier not found" });
    }

    // console.log("Authentication successful. Supplier:", req.supplier);
      
      
      next();
    } catch (error) {
      return res.status(401).json({ error: error.message });
    }
  } else {
    return res.status(403).json({ msg: "Unauthorized Access" });
  }
};

//supplier profile

exports.supplierProfile = async (req, res) => {
 
  try {
    const supplier = await Supplier.findById(req.supplier._id).select(
      "-password"
    );
    if (!supplier) {
      return res.status(401).json({ json: "No Authorization" });
    }
    return res.status(200).json(supplier);
  } catch (error) {
    console.log(error);
    return res.status(501).json({ msg: "Something went wrong" });
  }
};
