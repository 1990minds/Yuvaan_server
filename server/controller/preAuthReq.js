const PreauthRequest = require("../model/preAuthReq");
const { nanoid } = require("nanoid");

const preauthID = `Tconn${nanoid(6)}`;

//save new preauth request

exports.createPreauthRequest = async (req, res) => {
    console.log("My request is ", req.body);
    try {
        const {
            employeeDetails,
            selectedMember,
            treatmentDate,
            description,
            amount,
            preauthType,
            coverageType,
            uploadedFiles,
            emgRequest,
            prfComunication,
            preExtcondition,
            signatureFile,
            supplierId,
            employerId,
        } = req.body;

        // Ensure uploaded files are valid
        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ message: "At least one file is required." });
        }

        
        const newRequest = new PreauthRequest({
            employeeDetails,
            selectedMember,
            treatmentDate,
            description,
            amount,
            preauthType,
            coverageType,
            uploadedFiles,
            emgRequest,
            prfComunication,
            preExtcondition,
            signatureFile,
            supplierId,
            employerId,
            preauthID,
        });

        // Save the document
        const savedRequest = await newRequest.save();

        res.status(201).json({
            message: 'Thank you! We have received your Pre-auth request. Our team will review it and contact you shortly.',
            data: savedRequest,
        });
    } catch (error) {
        console.error('Error creating request:', error);

        res.status(500).json({
            message: 'An error occurred while creating the request',
            error: error.message,
        });
    }
};

//get an pre-auth request by supplierId
exports.getRequestBysupID = async (req, res) => {
    try {
        const { supid } = req.params;
        const request = await PreauthRequest.find({ supplierId: supid }).sort({ createdAt: -1 });
console.log("my requsted data is ",request)
        if (!request) {
            return res.status(404).json({ message: 'No Pre-auth request found' });
        }
        res.status(200).json({ message: 'Request retrieved successfully', data: request });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving request', error: error.message });
    }
}

//get preauth request by employee
exports.getRequestByEmployee = async (req, res) => {
    try {
        const { empId } = req.params;
        const request = await PreauthRequest.find({ employerId: empId }).sort({ createdAt: -1 });
        if (!request) {
            return res.status(404).json({ message: 'No request found for the given  employee' });
        }
        res.status(200).json({ message: 'Request retrieved successfully', data: request });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving request", error: error.message });
    }
}

//get on pre-auth request

exports.getOnePreauthRequest = async (req, res) => {
    try {
        const { id } = req.params
        const request = await PreauthRequest.findOne({ _id: id });
        res.status(200).json({ message: "Request successfully retrieved", data: request });
    } catch (e) {
        res.status(500).json({ message: "Error retrieving request", error: e.message });
    }
}

//update  the preauth request status

exports.updateRequestBysupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusValues, comments } = req.body
        const updateRequest = await PreauthRequest.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    "claimStatus.statusValues": statusValues,
                    "claimStatus.comments": comments,
                }
            }, { new: true }
        );
        if (!updateRequest) {
            return res.status(404).json({ message: 'No request found for the given ID' });
        }
        res.status(200).json({ message: 'Status updated successfully', data: updateRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error updating request', error: error.message });
    }
}

