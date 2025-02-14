const Insurer = require('../model/insurerAuth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const crypto = require("crypto");
const { createClient } = require('@supabase/supabase-js');


const SUPABASE_URL = 'https://pfipxxvfiwhqgjjioflv.supabase.co'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmaXB4eHZmaXdocWdqamlvZmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMDEyMzEsImV4cCI6MjA1MjY3NzIzMX0.Jd4xA94FgH7fXJ9giufM3546-E0Bqp1eh7lKQIOySJU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "64h",
    });
};

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

exports.createInsurer = async (req, res) => {
    const { user_name, email, phone_number } = req.body;

    try {
        const existInsurer = await Insurer.findOne({ email: email });
        if (existInsurer) {
            return res.status(401).json({ msg: 'Insurer already exists' });
        }

        const generatedPassword = generateSecureRandomPassword();

        // Create the insurer object
        const insurer = new Insurer({
            ...req.body,
            email: email.toLowerCase(),
            password: generatedPassword, // Assign generated password
        });

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        insurer.password = await bcrypt.hash(generatedPassword, salt); // Hash the generated password

        // Save to the database
        await insurer.save();

        // SendGrid setup and email sending
        sgMail.setApiKey(process?.env?.SENDGRID_API_KEY);
        const msg = {
            to: email,
            from: "corporate.solutions@rjac.co.in", // Your verified sender email
            subject: "Welcome to Total Connect - Your Employer Marketplace Solution!",
            html: `<p>Dear <b>${user_name},</b></p>
             <p>Welcome to Total Connect, your complete employer marketplace solution!</p>
             <p>We're excited to have you onboarded with us. Your account has been successfully created, and below are your login credentials:</p>
             <p>- Click here to login: <a href="https://total-connect-employer.web.app/">Total Connect Insurer</a></p> 
             <p>- Username: <b>${email}</b></p>
             <p>- Password: <b>${generatedPassword}</b></p>
             <p>Please log in to your account and begin adding your products. If you have any questions or need assistance, feel free to reach out to our support team at contact@totalconnect.com.</p>
             <p>Thank you for choosing Total Connect. We look forward to serving you!</p>
             <br/>
             <p>Best regards,</p>
             <p>The Total Connect Team</p>`,
        };
        await sgMail.send(msg);

        // Response
        return res.status(201).json({
            msg: `Insurer registered successfully. Login credentials sent to ${email}`,
            insurer,
        });
    } catch (err) {
        console.error(err);
        return res.status(501).json({ err: "Something went wrong!", details: err.message });
    }
};

exports.getAllInsurer = async (req, res) => {
    try {
        const insurer = await Insurer.find().sort({ createdAt: -1 })
        console.log("----->>>>",insurer)
        res.status(201).json({ msg: "successully get all Insurer", insurer });
    } catch (err) {
        res.status(500).json({ msg: "Something went wrong !" });
    }
}

exports.getOneInsurer = async (req, res) => {
    try {
        const insurer = await Insurer.findById(req.params.id)
        res.status(201).json({ msg: "successfully get one insurer", insurer });
    } catch (e) {
        res.status(500).json({ msg: "Something went wrong !", e });
    }
}


exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const insurer = await Insurer.findOne({ email: email });
        if (!insurer) {
            return res.status(400).json({ msg: "Invalid user" });
        }
        const isMatch = await bcrypt.compare(password, insurer.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid Password" });
        }
        const token = createToken(insurer._id);
        if (!token) {
            return res.status(500).json({ msg: "Token creation failed" });
        }
        res.status(201).json({ msg: "Logged-in Successfully", token, insurer });
    } catch (err) {
        console.log(err)
        res.status(401).json({ err: "Something went wrong !", err });
    }
}


exports.loginWithOtp = async (req, res) => {

    const { phone, otp } = req.body;
    console.log(phone);

    // Remove "91" prefix and keep the remaining 10 digits
    const formattedNum = phone.startsWith("91") ? phone.slice(2) : phone;
    console.log(formattedNum); // This will now show only the last 10 digits of the phone number

    try {
        // Step 1: Check if phone number exists
        const insurer = await Insurer.findOne({ phone_number: formattedNum });
        if (!insurer) {
            return res.status(400).json({ msg: 'Phone number not registered' });
        }

        if (!otp) {
            // Step 2: Send OTP if not provided
            const { error } = await supabase.auth.signInWithOtp({ phone: `+${phone}` });
            if (error) {
                return res.status(500).json({ msg: 'Error sending OTP', error: error.message });
            }
            return res.status(200).json({ msg: 'OTP sent successfully' });
        } else {
            // Step 3: Verify OTP
            const { data, error } = await supabase.auth.verifyOtp({
                phone: `+${phone}`,
                token: otp,
                type: 'sms',
            });

            if (error) {
                return res.status(400).json({ msg: 'Invalid OTP', error: error.message });
            }

            // Step 4: Generate JWT token after successful verification
            const token = createToken(insurer._id);
            if (!token) {
                return res.status(500).json({ msg: 'Error creating token' });
            }

            return res.status(200).json({
                msg: 'Logged in successfully',
                token,
                insurer,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Server error', error: error.message });
    }
};





exports.updateInsurerVehicleDetails = async (req, res) => {
    try {
        const insurerId = req.params.id
        const { vehicle_type, vehicle_no, pre_insurane, expireDate } = req.body;

        const insurer = await Insurer.findById(insurerId);
        if (!insurer) {
            return res.status(404).json({ msg: 'Insurer not found' });
        }

        insurer.empVehicleDetails.push({ vehicle_type, vehicle_no, pre_insurane, expireDate });

        await insurer.save();

        return res.status(200).json({ msg: 'Vehicle details added successfully', insurer });
    } catch (err) {

        return res.status(500).json({ msg: "Failed to add vehicle details", err });
    }
}


exports.updateEmployeeVehicleDetailsParicular = async (req, res) => {

    try {
        const insurerId = req.params.insurerID
        const vehicleId = req.params.vehicleID;
        const { vehicle_type, vehicle_no, prev_insurance, expireDate } = req.body;
        // Get the tenant-specific employee model
        const insurer = await Insurer.findById(insurerId);
        if (!insurer) {
            return res.status(404).json({ msg: "Insurer not found" });
        }
        // Find the vehicle detail by vehicle ID
        const vehicleDetail = insurer.empVehicleDetails.id(vehicleId);
        if (!vehicleDetail) {
            return res.status(404).json({ msg: "Vehicle detail not found" });
        }
        // Update the vehicle details
        vehicleDetail.vehicle_type = vehicle_type || vehicleDetail.vehicle_type;
        vehicleDetail.vehicle_no = vehicle_no || vehicleDetail.vehicle_no;
        vehicleDetail.prev_insurance = prev_insurance !== undefined ? prev_insurance : vehicleDetail.prev_insurance;
        vehicleDetail.expireDate = expireDate || vehicleDetail.expireDate;

        // Save the updated employee data
        await insurer.save();
        return res.status(200).json({
            msg: "Vehicle details updated successfully",
            insurer,
        });
    } catch (error) {
        return res.status(500).json({ msg: "Failed to update vehicle details" });
    }
};

