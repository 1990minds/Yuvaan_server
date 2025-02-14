const InsuranceRequest = require('../model/InsuranceRequest');
const { nanoid } = require('nanoid');

const insuranceID = `Tconn${nanoid(6)}`;


// Save a new health insurance request
exports.createRequest = async (req, res) => {
    console.log("my req body is", req.body);
    try {
        const {
            employeeDetails,
            selectedMember,
            treatmentDate,
            description,
            amount,
            uploadedFiles,
            supplierId,
            employerId,
        } = req.body;

        // Ensure uploaded files are valid
        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ message: "At least one file is required." });
        }

        // Create a new insurance request
        const newRequest = new InsuranceRequest({
            employeeDetails,
            selectedMember,
            treatmentDate,
            description,
            amount,
            uploadedFiles, 
            supplierId,
            employerId,
            insuranceID
        });

        // Save the request to the database
        const savedRequest = await newRequest.save();

        res.status(201).json({
            message: 'Thank you! We have received your claim request. Our team will review it and contact you shortly.',
            data: savedRequest
        });
    } catch (error) {
        console.error('Error creating request:', error);

        res.status(500).json({
            message: 'An error occurred while creating the request',
            error: error.message
        });
    }
};



// Get an insurance request by employeeId and supplierId
exports.getRequestByEmployee = async (req, res) => {
    try {
        const { empId } = req.params;

        const request = await InsuranceRequest.find({
            employerId: empId
        }).sort({ createdAt: -1 });
console.log(request);
        if (!request) {
            return res.status(404).json({ message: 'No request found for the given  employee' });
        }

        res.status(200).json({ message: 'Request retrieved successfully', request });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving request', error: error.message });
    }
},



    // Get an insurance request by  supplierId
    exports.getRequestBysupID = async (req, res) => {
        try {
            const { supid } = req.params;

            const request = await InsuranceRequest.find({
                supplierId: supid
            }).sort({ createdAt: -1 });

            if (!request) {
                return res.status(404).json({ message: 'No request found for the given supplier ' });
            }

            res.status(200).json({ message: 'Request retrieved successfully', data: request });
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving request', error: error.message });
        }
    },

    //Get one request
    exports.getOneInsurRequest = async (req, res) => {
        try {
            const { id } = req.params
            const request = await InsuranceRequest.findOne({ _id: id });
            res.status(200).json({ message: "Request successfully retrieved", data: request });
        } catch (e) {
            res.status(500).json({ message: "Error retrieving request", error: e.message });
        }
    }

// Update an insurance request by supplierId
exports.updateRequestBySupplier = async (req, res) => {
    try {
        const { id } = req.params;
        const { statusValues, comments } = req.body;

        // Update claimStatus fields explicitly
        const updatedRequest = await InsuranceRequest.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    "claimStatus.statusValues": statusValues,
                    "claimStatus.comments": comments,
                },
            },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'No request found for the given ID' });
        }

        res.status(200).json({ message: 'Status updated successfully', data: updatedRequest });
    } catch (error) {
        console.error("Error updating request:", error.message);
        res.status(500).json({ message: 'Error updating request', error: error.message });
    }
};
