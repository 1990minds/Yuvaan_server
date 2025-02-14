const express = require('express');
const multer = require('multer');
const path = require('path');

// const { isAuthenticateSupplier } = require('../controller/supplier');
const { empBudgetUpload,getAllEmployeerBudget } = require('../controller/empBudget');

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

const employeeBudgetRoute = express.Router();

// Route for bulk uploading products
employeeBudgetRoute.post('/employeesBudget/:tenantID', upload.single('file'), empBudgetUpload);

employeeBudgetRoute.get('/employerBudget/:tenantID', getAllEmployeerBudget);




// employeeBudgetRoute.post('/employee', createEmployee);



module.exports = employeeBudgetRoute;
