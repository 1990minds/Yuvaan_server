const Admin = require("../model/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "64h",
  });
};


exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existadmin = await Admin.findOne({ email: req.body.email });
    if (existadmin) {
      return res.status(401).json({ msg: "Email already exists!" });
    }

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res
        .status(401)
        .json({
          msg: "Password should be at least 8 characters with one uppercase letter and special symbols without spaces",
        });
    }
    const admin = await Admin.create(req.body);
    admin.email = email.toLowerCase();

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(password, salt);

    await admin.save();

    return res
      .status(201)
      .json({ msg: "Admin Registered Successfully", admin });
  } catch (error) {
    return res.status(501).json({ err: "Something went wrong !", error });
  }
};




//get all admin
exports.getAllAdmin = async (req, res) => {
  try {
    const admin = await Admin.find({}).sort({ createdAt: -1 });

    res.status(201).json({ msg: "Successfully", admin });
  } catch (error) {
    res.status(401).json({ err: "Something went wrong !", error });
  }
};
//get one admin
exports.getOneAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.status(201).json({ msg: "Successfully", admin });
  } catch (error) {
    res.status(401).json({ err: "Something went wrong !", error });
  }
};

//update admin
exports.updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(req.body.password, salt);
    }

    await Admin.updateOne({ _id: req.params.id }, req.body);

    await admin.save();

    res.status(201).json({ msg: "Admin Updated Successfully" });
  } catch (error) {
    res.status(401).json({ msg: "Something went wrong !", error });
  }
};

//delete admin
exports.deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete({ _id: req.params.id });

    res.status(201).json({ msg: "Deleted Successfully", admin });
  } catch (error) {
    res.status(401).json({ err: "Something went wrong !", error });
  }
};

/*****admin login********/
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email: email });
    if (!admin) {
      return res.status(400).json({ msg: "Invalid User" });
    }
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    const token = createToken(admin._id);
    if (!token) {
      return res.status(500).json({ msg: "Token creation failed" });
    }

    res.status(201).json({ msg: "Logged-in Successfully", token, admin });
  } catch (error) {
    res.status(401).json({ err: "Something went wrong !", error });
  }
};

exports.isAuthenticateAdmin = async (req, res, next) => {
  // console.log("Incoming request headers:", req.headers);

  const authHeader = req.headers.authorization;
  // console.log("Authorization header:", authHeader);

  if (authHeader && authHeader.startsWith("Bearer")) {
    try {
      const token = authHeader.split(" ")[1];
      // console.log("Token extracted from header:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("Decoded token:", decoded);

      if (!decoded.id) {
        // console.log("Invalid token: No user ID found in decoded token.");
        return res.status(401).json({ error: "Invalid Token" });
      }

      req.admin = await Admin.findById(decoded.id).select("-password");
      // console.log("Admin details from database:", req.admin);

      if (!req.admin) {
        // console.log("Admin not found in database.");
        return res.status(401).json({ error: "Admin not found" });
      }

      // console.log("Authentication successful. Admin:", req.admin);
      next();
    } catch (error) {
      // console.log("Error occurred during token verification:", error);
      return res.status(401).json({ error: error.message });
    }
  } else {
    // console.log("Authorization header missing or invalid format.");
    return res.status(403).json({ msg: "Unauthorized Access" });
  }
};

/********admin profile*********/
exports.adminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    if (!admin) {
      return res.status(401).json({ json: "No Authorization" });
    }
    return res.status(200).json(admin);
  } catch (error) {
    return res.status(501).json({ msg: "Something went wrong" });
  }
};
