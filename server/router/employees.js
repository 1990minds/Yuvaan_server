const express = require('express');
const multer = require('multer');
const path = require('path');

// const { isAuthenticateSupplier } = require('../controller/supplier');
const { employeeBulkUpload,getAllEmployees, getAllEmployeesLevaesFormRjac, getAllEmployeesForDashboard, login, getEmployeeById, updateEmployeeRewards, updateEmployeeRecommendedProducts, updateEmployeeSkills } = require('../controller/employees');

// Multer configuration for file upload
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

const employeesRoute = express.Router();

// Route for bulk uploading products
employeesRoute.post('/employeesBulk/:tenantID', upload.single('file'), employeeBulkUpload);

// Routes for CRUD operations on products
employeesRoute.get('/employee/:tenantID', getAllEmployees);

employeesRoute.get('/rajcEmployee/:tenantID',getAllEmployeesLevaesFormRjac)
employeesRoute.get('/dasboardEmployee/:tenantID',getAllEmployeesForDashboard)

// employeesRoute.post('/employee', createEmployee);
employeesRoute.post("/employeeAuth", login);
employeesRoute.get('/:tenantID/employees/:employeeID', getEmployeeById);
employeesRoute.put('/:tenantID/:employeeID/rewards', updateEmployeeRewards);
employeesRoute.put('/:tenantID/:employeeID/recomended', updateEmployeeRecommendedProducts);
employeesRoute.put('/:tenantID/:employeeID/skills', updateEmployeeSkills);



module.exports = employeesRoute;
