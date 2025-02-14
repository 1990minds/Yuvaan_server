const getEmployeeBudgetModelbulk = require("../model/employeBudget");
const xlsx = require("xlsx");
const fs = require("fs");

exports.empBudgetUpload = async (req, res) => {
    const tenantID = req.params.tenantID;
 
  
    // Fetch the employee model for the specific tenant
    const employeesBulkData = await getEmployeeBudgetModelbulk(tenantID);
 
  
    // Checking if there's an error in the request or if no file is uploaded
    if (req.error || !req.file.filename) {
      return res.status(500).json({ msg: "Excel file only" });
    }
  
    // Reading the uploaded Excel file
    let workbook = xlsx.readFile(`./uploads/${req.file?.filename}`);
  
    // Defining columns mapping for employee data
    const columns = {
      type: 0,
      name: 1,
      value: 2,
    };
  
    // Extracting data from the first sheet of the workbook
    let sheet = workbook.Sheets[workbook.SheetNames[0]];
  
    // Decoding the range of the sheet
    const range = xlsx.utils.decode_range(sheet["!ref"]);
  
    // Array to store extracted employee data
    const extractedDataBulk = [];
    let employeeAllBulk = [];
  
    // Looping through each row of the sheet to extract employee data
    for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
      const row = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 0 })];
      if (row) {
        const rowData = {
          type: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.type })]?.w || "",
          name: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.name })]?.w || "",
          value: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.value })]?.w || "",
  
          tenant_id: tenantID,
        };
        extractedDataBulk?.push(rowData);
      }
    }
  
   
  
    // Fetching existing employee data from the database
    const dbdatabulk = await employeesBulkData.find();
   
    // Looping through extracted employee data and processing each entry
    for (let eachEmployeebulk = 0; eachEmployeebulk < extractedDataBulk.length; eachEmployeebulk++) {
      let foundMatch = false;
      for (let i = 0; i < dbdatabulk.length; i++) {
        const existEmployeebulk = dbdatabulk[i];
  
        const dbEmployeeemployeeCodebulk = existEmployeebulk.name;
        const excelEmployeeemployeeCodebulk = extractedDataBulk[eachEmployeebulk]?.name;
  
        if (dbEmployeeemployeeCodebulk === excelEmployeeemployeeCodebulk) {
          foundMatch = true;
  
          await employeesBulkData.updateOne(
            { name: dbEmployeeemployeeCodebulk },
            extractedDataBulk[eachEmployeebulk]
          );

          break;
        }
      }
  
      if (!foundMatch) {
        const employeeData = await employeesBulkData.create(extractedDataBulk[eachEmployeebulk]);
        employeeAllBulk.push(employeeData);
      }
    }
  
    // Delete the uploaded file after processing
    fs.unlink(`./uploads/${req.file.filename}`, function (err) {
      if (err) throw err;
      console.log('File deleted!', req.file.filename);
    });
  
    // Sending response based on whether new employees were uploaded or not
    employeeAllBulk.length <= 0 ?
      res.status(302).json({ msg: "No new details to upload" }) :
      res.status(200).json({ msg: "Employee details uploaded successfully", employeeAllBulk });
  };



  //Get all employees
exports.getAllEmployeerBudget = async (req, res) => {
  try {
    const tenantId = req.params.tenantID;

    const Employeebudget = await getEmployeeBudgetModelbulk(tenantId);
    const employerbud = await Employeebudget.find().sort({createdAt: -1});

    return res.status(200).json({ msg: "Success", employerbud });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to fetch employer budget" });
  }
};