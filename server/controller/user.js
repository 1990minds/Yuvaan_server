const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sgMail = require('@sendgrid/mail');


const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "64h",
  });
};

function generateSecureRandomPassword() {
  const passwordLength = 12;

  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numericChars = "0123456789";
  const specialChars = "!@#$&";

  const allChars =
    lowercaseChars + uppercaseChars + numericChars + specialChars;

  const randomBytes = crypto.randomBytes(passwordLength);

  // Map each byte to an index in the character set and concatenate
  const password = Array.from(randomBytes)
    .map((byte) => allChars[byte % allChars.length])
    .join("");

  return password;
}

exports.createUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existUser = await User.findOne({ email: req.body.email });
    if (existUser) {
      return res.status(401).json({ msg: "Email already exists!" });
    }
    const generatedPassword = generateSecureRandomPassword();
    const user = new User({
      ...req.body,
      password: generatedPassword,
    });
    user.email = email.toLowerCase();
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();


    
    sgMail.setApiKey(process?.env?.SENDGRID_API_KEY)
    const msg = {
      to: req?.body?.email,
      cc: "1990moffice@gmail.com",
      from: "corporate.solutions@rjac.co.in",
      subject: "Welcome to Total Connect!",
      html: `<p>Dear <b>${req?.body?.user_name},</b></p>
            <p>Welcome to Total Connect!</p>
            
            <p>Your account has been successfully created, and below are your login credentials :</p>
            <p>- Click here to login : <a href="https://total-connect-employer.web.app/">Total Connect Admin</a></P> 
            <p>- Username : <b>${req?.body?.email}</b></P>
             <p>- Password : <b>${generatedPassword}</b></P>
             <p>Please log in to your account. If you have any questions or need assistance, feel free to reach out to our support team at contact@totalconnect.com</P>
             <p>Thank you!</p>
             <br/>
             <p>Best regards,</p>
             <p>The Total Connect Team</p>
      
      `,
    };
    await sgMail.send(msg);

    return res.status(200).json({ msg: "User created successfully", user });
  } catch (error) {
 
    return res.status(501).json({ err: "Something went wrong!", error });
  }
};

//get all user

exports.getAllUser = async (req, res) => {
  try {
    const user = await User.find().sort({ createdAt: -1 });

    res.status(200).json({ msg: "Successfully fetched all users", user });
  } catch (error) {
   
    res.status(404).json({ msg: "Users Not Found" });
  }
};

//get One

exports.getOneUser = async (req, res) => {
 
  try {
    const user = await User.findById(req.params?.id);
    res.status(201).json({ msg: "Successfully fetched one user", user });
  } catch (error) {
    
    res.status(401).json({ err: "Something went wrong !", error });
  }
};

//update user
exports.updateUser = async (req, res) => {

  const { password } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (password) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(401).json({
          msg: "Password should be at least 8 characters with one uppercase letter and special symbols without spaces",
        });
      } else {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
    } else {
      req.body.password = user.password; 
    }

    await User.updateOne({ _id: req.params.id }, req.body);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: req.body.email,
      cc: "1990moffice@gmail.com",
      from: "corporate.solutions@rjac.co.in",
      subject: "Your Total Connect Account is updated.",
      html: `<p>Dear <b>${req.body.user_name},</b></p>
            <p>Welcome to Total Connect!</p>
            <p>Your account has been successfully updated, and below are your login credentials:</p>
            <p>- Click here to login: <a href="https://total-connect-employer.web.app/">Total Connect Admin</a></P> 
            <p>- Username: <b>${req.body.email}</b></P>
             <p>- Password: <b>${password ? password : '********'}</b></P>
             <p>Please log in to your account. If you have any questions or need assistance, feel free to reach out to our support team at contact@totalconnect.com</P>
             <p>Thank you!</p>
             <br/>
             <p>Best regards,</p>
             <p>The Total Connect Team</p>
      `,
    };
    await sgMail.send(msg);
    res.status(201).json({ msg: "User Updated Successfully" });
  } catch (error) {
   
    res.status(401).json({ msg: "Something went wrong!", error });
  }
};

//delete
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.params.id });

    res.status(201).json({ msg: "User deleted Successfully", user });
  } catch (error) {
    res.status(401).json({ err: "Something went wrong !", error });
  }
};

//User login

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ msg: "Invalid User" });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid Password" });
      }
      const token = createToken(user._id);
  
      if (!token) {
        return res.status(500).json({ msg: "Token creation failed" });
      }
      res.status(201).json({ msg: "Logged-in Successfully", token, user });
    } catch (error) {
   
      res.status(401).json({ err: "Something went wrong !", error });
    }
  };


  exports.isAuthenticateUser = async (req, res, next) => {
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
  
        req.user = await User.findById(decoded.id).select("-password");
        // console.log("User details from database:", req.user);
  
        if (!req.user) {
          // console.log("User not found in database.");
          return res.status(401).json({ error: "User not found" });
        }
  
        // console.log("Authentication successful. user:", req.user);
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


  /********user profile*********/
exports.userProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(401).json({ json: "No Authorization" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(501).json({ msg: "Something went wrong" });
  }
};
