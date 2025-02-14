const express = require('express');
const multer = require('multer');
const path = require('path');
const { employeeUAEBulkUpload,getAllEmployeesUAE, login, isAuthenticateEmployer, employerProfile, getEmployeeById, updateEmployeeRewards, updateEmployeeRecommendedProducts, updateEmployeeSkills, updateEmployeeVehicleDetails, updateEmployeeVehicleDetailsParicular, useEmployeeRewards } = require('../controller/employeeUAE');




const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });
  
  const employeesUAERoute = express.Router();
  
  // Route for bulk uploading products
  employeesUAERoute.post('/employeesUAEBulk/:tenantID', upload.single('file'), employeeUAEBulkUpload);
  employeesUAERoute.get('/employeeUAE/:tenantID', getAllEmployeesUAE);
  employeesUAERoute.get('/:tenantID/employeesUAE/:employeeID', getEmployeeById);
  employeesUAERoute.put('/:tenantID/:employeeID/rewardUAE', updateEmployeeRewards);
  employeesUAERoute.put('/:tenantID/:employeeID/rewardUAEbyEmployee', useEmployeeRewards);

  employeesUAERoute.put('/:tenantID/:employeeID/recomendedUAE', updateEmployeeRecommendedProducts);
  employeesUAERoute.put('/:tenantID/:employeeID/skillsUAE', updateEmployeeSkills);
  employeesUAERoute.put('/:tenantID/:employeeID/vehicleDetailsUAE', updateEmployeeVehicleDetails);
  employeesUAERoute.put('/:tenantID/employeeID/vehicle/:vehicleID',updateEmployeeVehicleDetailsParicular)



  employeesUAERoute.post("/employeeAuthUAE", login);





  module.exports = employeesUAERoute;