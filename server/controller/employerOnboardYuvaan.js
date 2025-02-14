
const OnboardingForm = require('../model/employerOnboardYuvaan');


exports.createEmployeeOnboardYuvaan = async (req, res) => {
    try {
        const newOnboardingForm = new OnboardingForm(req.body);

        // Save the new form to the database
        const savedForm = await newOnboardingForm.save();

        // Respond with the saved form data
        res.status(201).json({
            message: 'Employee Onboard Form created successfully',
            data: savedForm
        });
    } catch (error) {
        // Handle errors and respond with an error message
      
        res.status(500).json({
            message: 'Error creating Employee Onboard Form',
            error: error.message
        });
    }
};


// Controller to handle fetching all employee onboard forms or a specific one by ID
 exports.getEmployeeOnboardYuvaan = async (req, res) => {
    try {
        const { id } = req.params; 

        // Fetch a specific form if an id is provided, otherwise fetch all forms
        let onboardingForms;
        if (id) {
            onboardingForms = await OnboardingForm.findById(id);
            if (!onboardingForms) {
                return res.status(404).json({ message: 'Onboarding form not found' });
            }
        } else {
            onboardingForms = await OnboardingForm.find(); 
        }

        // Respond with the retrieved forms
        res.status(200).json(onboardingForms);
    } catch (error) {
        // Handle errors and respond with an error message
    
        res.status(500).json({
            message: 'Error fetching Employee Onboard Forms',
            error: error.message
        });
    }
};


//Get all Employee onboard
 exports.getAllEmployeeOnboardYuvaan = async (req, res) => {
    try {
        const onboardingForms = await OnboardingForm.find(); 
        res.status(200).json(onboardingForms); 
    } catch (error) {
        // Handle errors and respond with an error message
        res.status(500).json({
            message: 'Error fetching Employee Onboard Forms',
            error: error.message
        });
    }
};