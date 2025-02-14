const WellService = require("../model/wellnessService");
const { customAlphabet } = require('nanoid');

const generatePolicyId = () => {
  const nanoid = customAlphabet('1234567890', 6);
  return `Yuvaan${nanoid()}`;
};

// Create a new wellness service
exports.createWellService = async (req, res) => {
    try {
        // Generate a new serviceId for each request
        const serviceId = generatePolicyId();

        // Create a new well service with serviceId
        const wellService = new WellService({
            ...req.body,
            serviceId   
        });

        await wellService.save();
        res.status(201).json(wellService);
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

// Get all wellness services
exports.getAllWellServices = async (req, res) => {
    try {
        const services = await WellService.find().populate("subProId emprID supID")
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get wellness service by supplier ID
exports.getWellServiceBySupplier = async (req, res) => {
    try {
        const services = await WellService.find({ supID: req.params.supID }).populate("subProId emprID supID")
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get wellness service by supplier ID
exports.getWellServiceByEmployer = async (req, res) => {
    try {
        const services = await WellService.find({ emprID: req.params.empID }).populate("subProId emprID supID")
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get wellness service by employee ID
exports.getWellServiceByEmployee = async (req, res) => {
    console.log(req.params.employeeID)
    try {
        const services = await WellService.find({ employeeID: req.params.employeeID }).sort({createdAt : -1}).populate("subProId emprID supID")
        console.log(services)
        res.status(200).json(services);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// Get single wellness service by ID
exports.getWellServiceById = async (req, res) => {
    try {
        const service = await WellService.findById(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" }).populate("subProId emprID supID")
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update wellness service by ID
exports.updateWellService = async (req, res) => {
    try {
        const service = await WellService.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete wellness service by ID
exports.deleteWellService = async (req, res) => {
    try {
        const service = await WellService.findByIdAndDelete(req.params.id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
