const express = require("express");
const router = express.Router();
const wellServiceController = require("../controller/wellnessService");

// Create a new wellness service
router.post("/createWellService", wellServiceController.createWellService);

// Get all wellness services
router.get("/getAllWellServices", wellServiceController.getAllWellServices);

// Get a wellness service by supplier ID
router.get("/getBysupplier/:supID", wellServiceController.getWellServiceBySupplier);

// Get a wellness service by supplier ID
router.get("/getByemployer/:empID", wellServiceController.getWellServiceByEmployer);

// Get a wellness service by employee ID
router.get("/getByemployee/:employeeID", wellServiceController.getWellServiceByEmployee);

// Get a single wellness service by ID
router.get("getWellServices/:id", wellServiceController.getWellServiceById);

// Update a wellness service by ID
router.put("updateWellServices/:id", wellServiceController.updateWellService);

// Delete a wellness service by ID
router.delete("deleteWellService/:id", wellServiceController.deleteWellService);

module.exports = router;
