const crypto = require("crypto");
const getEmployeeModel = require("../model/employees");
const xlsx = require("xlsx");
const fs = require("fs");
const axios  = require("axios");
const sgMail = require('@sendgrid/mail');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const MarketplacePro = require("../model/marketPlace");
const mongoose = require('mongoose');


function generateSecureRandomPassword(){

  const passwordLength = 12

  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numericChars = '0123456789';
  const specialChars = '!@#$&';

  const allChars = lowercaseChars + uppercaseChars + numericChars + specialChars

  const randomBytes = crypto.randomBytes(passwordLength)

  const password = Array.from(randomBytes).map(byte => allChars[byte % allChars.length]).join('')

  return password
}

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "64h"
  })
}

exports.employeeBulkUpload = async (req, res) => {
  const tenantID = req.params.tenantID;

  // Fetch the employee model for the specific tenant
  const employeesData = await getEmployeeModel(tenantID);


  // Checking if there's an error in the request or if no file is uploaded
  if (req.error || !req.file.filename) {
    return res.status(500).json({ msg: "Excel file only" });
  }

  // Reading the uploaded Excel file
  let workbook = xlsx.readFile(`./uploads/${req.file?.filename}`);

  // Defining columns mapping for employee data
  const columns = {
    employeeCode: 0,
    employeeName: 1,
    gender: 2,
    dateofBirth: 3,
    dateofJoining: 4,
    position: 5,
    lastPromotedon: 6,
    currentSalary: 7,
    currentManager: 8,
    department: 9,
    country: 10,
    officeLocation: 11,
    employeeResidence: 12,
    email: 13,
    phone: 14,
  };

  

  // Extracting data from the first sheet of the workbook
  let sheet = workbook.Sheets[workbook.SheetNames[0]];

  // Decoding the range of the sheet
  const range = xlsx.utils.decode_range(sheet["!ref"]);

  // Array to store extracted employee data
  const extractedData = [];
  let employeeAll = [];

  // Looping through each row of the sheet to extract employee data
  for (let rowNum = range.s.r + 1; rowNum <= range.e.r; rowNum++) {
    const row = sheet[xlsx.utils.encode_cell({ r: rowNum, c: 0 })];
    if (row) {
      const rowData = {
        employeeCode: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.employeeCode })]?.w || "",
        employeeName: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.employeeName })]?.w || "",
        gender: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.gender })]?.w || "",
        dateofBirth: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.dateofBirth })]?.w || "",
        dateofJoining: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.dateofJoining })]?.w || "",
        position: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.position })]?.w || "",
        lastPromotedon: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.lastPromotedon })]?.w || "",
        currentSalary: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.currentSalary })]?.w || "",
        currentManager: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.currentManager })]?.w || "",
        department: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.department })]?.w || "",
        country: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.country })]?.w || "",
        officeLocation: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.officeLocation })]?.w || "",
        employeeResidence: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.employeeResidence })]?.w || "",
        email: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.email })]?.w || "",
        phone: sheet[xlsx.utils.encode_cell({ r: rowNum, c: columns?.phone })]?.w || "",
        tenant_id: tenantID,
        password: ""
      };
      extractedData?.push(rowData);
    }
  }

  // Fetching existing employee data from the database
  const dbdata = await employeesData.find();

// Looping through extracted employee data and processing each entry
for (let eachEmployee = 0; eachEmployee < extractedData.length; eachEmployee++) {
  let foundMatch = false;
  for (let i = 0; i < dbdata.length; i++) {
    const existEmployee = dbdata[i];

    const dbEmployeeemployeeCode = existEmployee.employeeCode;
    const excelEmployeeemployeeCode = extractedData[eachEmployee]?.employeeCode;

    if (dbEmployeeemployeeCode === excelEmployeeemployeeCode) {
      foundMatch = true;
      await employeesData.updateOne(
        { employeeCode: dbEmployeeemployeeCode },
        extractedData[eachEmployee]
      );
     
      break;
    }
  }

  if (!foundMatch) {
      // Sending welcome email via SendGrid
      const rowData = extractedData[eachEmployee]; // Get the current employee's data
      const username = rowData.email;
      const password = generateSecureRandomPassword();
      const salt = await bcrypt.genSalt(10);
      rowData.password = await bcrypt.hash(password, salt);;

      const employeeData = await employeesData.create(extractedData[eachEmployee]);
      employeeAll.push(employeeData);

    try {
      sgMail.setApiKey(process?.env?.SENDGRID_API_KEY);
      const msg = {
        to: rowData.email,  // Correctly using rowData.email instead of req.body.email
        from: "corporate.solutions@rjac.co.in", // Your verified sender email
        subject: "Welcome to Total Connect - Your Employer Marketplace Solution!",
        html: `<p>Dear <b>${rowData.employeeName},</b></p>
               <p>Welcome to Total Connect, your complete employer marketplace solution!</p>
               <p>We're excited to have you onboarded with us. Your account has been successfully created, and below are your login credentials:</p>
               <p>- Click here to login: <a href="https://total-connect-employer.web.app/">Total Connect Employer</a></p> 
               <p>- Username: <b>${username}</b></p>
               <p>- Password: <b>${password}</b></p>
               <p>Please log in to your account and begin adding your products. If you have any questions or need assistance, feel free to reach out to our support team at contact@totalconnect.com.</p>
               <p>Thank you for choosing Total Connect. We look forward to serving you!</p>
               <br/>
               <p>Best regards,</p>
               <p>The Total Connect Team</p>`
      };
      await sgMail.send(msg);
     
    } catch (error) {
      console.error(`Error sending email to ${rowData.email}:`, error);
    }
  }
}

 // Identify and delete employees that are in the database but not in the uploaded file
 const extractedEmployeeCodes = extractedData.map(emp => emp.employeeCode);
 const employeesToDelete = dbdata.filter(dbEmp => !extractedEmployeeCodes.includes(dbEmp.employeeCode));

 for (const emp of employeesToDelete) {
   await employeesData.deleteOne({ employeeCode: emp.employeeCode });

 }
  // Delete the uploaded file after processing
  fs.unlink(`./uploads/${req.file.filename}`, function (err) {
    if (err) throw err;

  });

  // Sending response based on whether new employees were uploaded or not
  employeeAll.length <= 0 ?
    res.status(302).json({ msg: "No new details to upload" }) :
    res.status(200).json({ msg: "Employee details uploaded successfully", employeeAll });
};




//Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const tenantId = req.params.tenantID;

    const Employee = await getEmployeeModel(tenantId);
    const employees = await Employee.find();

    return res.status(200).json({ msg: "Success", employees });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to fetch employees" });
  }
};


async function getSomeInfoFromRJACApplication(){

   
  try{

     const responses = await Promise.all(
      [
          
         
          await axios.get('https://oyster-app-f6s5e.ondigitalocean.app/api/gratuityprojects'),
          await axios.get('https://oyster-app-f6s5e.ondigitalocean.app/api/leaveValuation'),
          
          // await axios.get('http://localhost:8000/api/gratuityprojects'),
          // await axios.get('http://localhost:8000/api/leaveValuationTC'),

      ]
     )


     const [grad,leaveData]=responses
   
    
     const gradData = grad.data
     const leaveinfo = leaveData.data

   

      return{
 
          gradData,
          leaveinfo
      }
  }catch(error){
      console.log(error);
      throw error
  }
}


exports.getAllEmployeesLevaesFormRjac = async (req, res) => {

const tenantId = req.params.tenantID;

  try{
    const {gradData,leaveinfo} = await getSomeInfoFromRJACApplication()


  
   
   const leaveInfo = await leaveinfo?.filter(item=>item?.client?.totalConnect_id==tenantId)
  
    const gradinfo = await gradData.find(item=>item?.client?.totalConnect_id==tenantId)
  
     const totalEmployee = gradinfo?.employee_data?.summary?.total_employee  || 0
     const totalYearlySalary = gradinfo?.employee_data?.summary?.toatal_monthly_salary || 0
     const averageAge = gradinfo?.employee_data?.summary?.avrage_age || 0
     const averagePastService = gradinfo?.employee_data?.summary?.avrage_past_service || 0
     const averageEntryAge = gradinfo?.employee_data?.summary?.avrage_entry_age || 0
const aggregratetotalDbo= gradinfo?.employee_data?.aggregrate.totalDBO || 0
const aggregrateyear1 = gradinfo?.employee_data?.aggregrate?.totalYear1 || 0
const aggregrateyear2 = gradinfo?.employee_data?.aggregrate?.totalYear2 || 0

const aggregrateyear3 = gradinfo?.employee_data?.aggregrate?.totalYear3 || 0

const aggregrateyear4 = gradinfo?.employee_data?.aggregrate?.totalYear4 || 0

const aggregrateyear5 = gradinfo?.employee_data?.aggregrate?.totalYear5 || 0

const aggregrateyear6 = gradinfo?.employee_data?.aggregrate?.totalYear6 || 0
const totalgraduity = parseFloat(aggregrateyear1
+ aggregrateyear2 + aggregrateyear3 +  aggregrateyear4 +aggregrateyear5 +aggregrateyear6
)


const salaryesca1st3years=gradinfo?.salary_escalation?.first3years  || 0
const salaryescafter3years=gradinfo?.salary_escalation?.after3years || 0

const fixedAttrition = gradinfo?.attrition?.fixed_withdrawal_rat || 0
const terminationAttrition = gradinfo?.attrition?.termination_weightage|| 0
const resignationAttrition = gradinfo?.attrition?.resignation_weightage|| 0
const withdrawrateone  =gradinfo?.employee_data?.sensitivity_analysis?.withdrawalRatwPlus1|| 0


const leaves = {}
 leaveInfo.forEach(leave=>{
  const leaveType = leave.leave_type
  const amount = leave.aggregrate.totalDBO
  const futureAmount =
  parseFloat(leave.aggregrate.totalYear1) +
  parseFloat(leave.aggregrate.totalYear2) +
  parseFloat(leave.aggregrate.totalYear3) +
  parseFloat(leave.aggregrate.totalYear4) +
  parseFloat(leave.aggregrate.totalYear5) +
  parseFloat(leave.aggregrate.totalYear6);

 
  if(leaveType in leaves){
    leaves[leaveType].currentamount += amount 
    leaves[leaveType].futureamount += futureAmount 

}else{
leaves[leaveType]={
currentamount:amount,
futureamount:futureAmount
}
}
 })

const leavesArray = Object.entries(leaves).map(([leave,data])=>({
typeOfLeave : leave,
CurrentAmount : data.currentamount,
FutureAmount:data.futureamount

}))


    if (gradinfo){
        
return res.status(200).json({ msg: "Success", 
totalEmployee,
totalYearlySalary,
averageAge,
averagePastService,
averageEntryAge,
aggregratetotalDbo,
aggregrateyear1,
aggregrateyear2,
aggregrateyear3,
aggregrateyear4,
aggregrateyear5,
aggregrateyear6,
salaryesca1st3years,
salaryescafter3years,
fixedAttrition,
terminationAttrition,
resignationAttrition,
withdrawrateone,
leavesArray,
totalgraduity


});
      
      // return{
      //   totalEmployee,
      //   totalYearlySalary,
      //   averageAge,
      //   averagePastService,
      //   averageEntryAge,
      //   aggregratetotalDbo,
      //   aggregrateyear1,
      //   aggregrateyear2,
      //   aggregrateyear3,
      //   aggregrateyear4,
      //   aggregrateyear5,
      //   aggregrateyear6,
      //   salaryesca1st3years,
      //   salaryescafter3years,
      //   fixedAttrition,
      //   terminationAttrition,
      //   resignationAttrition,
      //   withdrawrateone,
      //   leavesArray,
      //   totalgraduity



      // }
    }else{
        
        return ("No info found with ID:", tenantId)
       
    }
    
    
    

}catch(error){
    
    return res.status(500).json({ msg: "Failed to fetch employees" });
    
}
};




exports.getAllEmployeesForDashboard = async (req, res) => {
  try{

    const tenantId = req.params.tenantID;

    const EmployeeData = await getEmployeeModel(tenantId)


    const {
      positionSalaryRangeArray
    } = await getPositionSalaryRange(tenantId)

    const Employee = await EmployeeData.find();

   const employeeDepartment = {}
   let employeeDepartmentSalary = 0
   const employeePosition={}
   let employeePositionSalary = 0
   
   
  Employee.forEach(emp => {
      const departmentName = emp.department;
      const positionName = emp.position;
      const salary = parseFloat(emp?.currentSalary);

      
      if (!(departmentName in employeeDepartment)) {
          employeeDepartment[departmentName] = {
              noOfemp: 0,
              employeesSalary: 0,
              positions: {} 
          };
      }

      
      employeeDepartment[departmentName].noOfemp++;
      employeeDepartment[departmentName].employeesSalary += salary;

     
      if (!(positionName in employeeDepartment[departmentName].positions)) {
          employeeDepartment[departmentName].positions[positionName] = {
              noOfEmp: 1,
              employeesSalary: salary
          };
      } else {
          employeeDepartment[departmentName].positions[positionName].noOfEmp++;
          employeeDepartment[departmentName].positions[positionName].employeesSalary += salary;
      }
  });

  
  const employeeDepartmentArray = Object.entries(employeeDepartment).map(([departmentName, data]) => ({
      departmentName: departmentName,
      numberEmp: data.noOfemp,
      totalSalary: data.employeesSalary,
      averageSalary: parseFloat(data.employeesSalary / data.noOfemp),
      positions: Object.entries(data.positions).map(([positionName, positionData]) => ({
          positionName: positionName,
          numberEmp: positionData.noOfEmp,
          totalSalary: positionData.employeesSalary,
          averageSalary: parseFloat(positionData.employeesSalary / positionData.noOfEmp)
      }))
  }));


  const grandTotalCount = employeeDepartmentArray.reduce((total, { numberEmp }) => total + numberEmp, 0);

 




//position
Employee.forEach(emp=>{
  const positionName = emp.position
  const salary =  parseFloat(emp?.currentSalary)
  const numEmp = 1
  if (positionName in employeePosition){
    employeePosition[positionName].noOfEmp +=numEmp
    employeePosition[positionName].employeesSalary +=salary
  }else{
    employeePosition[positionName]={
      noOfEmp :numEmp,
      employeesSalary:salary
    }
  }
 
})
const employeePositionArray  = Object?.entries(employeePosition)?.map(([positionName,data])=>({
  positionName:positionName,
  numberEmp:data.noOfEmp,
  totalSalary: data.employeesSalary,
  averageSalary: parseFloat(data.employeesSalary / data.noOfEmp)
  
  }))
 
  const grandTotalPositionCount = employeePositionArray?.reduce((total, { numberEmp }) => total + numberEmp, 0);
  
return res.status(200).json({ msg: "Success", 
employeeDepartmentArray,
grandTotalCount,
employeePositionArray,
grandTotalPositionCount,
positionSalaryRangeArray
 });

// return {
//     employeeDepartmentArray,
   
//     grandTotalCount,
//     employeePositionArray,
//     grandTotalPositionCount
//    }
 
  }catch(error){
    console.log(error)
    return res.status(500).json({ msg: "Failed to fetch employees" });
  }

};



async function getPositionSalaryRange(tenantID) {
  try{
  const EmployeeData = await getEmployeeModel(tenantID)

  const Employee = await EmployeeData.find()
  const positionSalaryRange = {};

  
  Employee.forEach(emp => {
      const position = emp?.position;
      const salary = parseFloat(emp?.currentSalary); 

      if (position in positionSalaryRange) {
          
          positionSalaryRange[position].minSalary = Math.min(positionSalaryRange[position].minSalary, salary);
          positionSalaryRange[position].maxSalary = Math.max(positionSalaryRange[position].maxSalary, salary);
      } else {
          
          positionSalaryRange[position] = {
              minSalary: salary,
              maxSalary: salary
          };
      }
  });

  
  const positionSalaryRangeArray = Object.entries(positionSalaryRange).map(([position, range]) => ({
      position: position,
      minSalary: range.minSalary,
      maxSalary: range.maxSalary
  }));

  return {positionSalaryRangeArray};
}
catch(error){
  throw error
}
}



//India Ecom api

exports.login = async (req, res) => {

  const { email, password, tenantID } = req.body;

  try {
    const Employee = await getEmployeeModel(tenantID);
    // Await the result of findOne to get the employee data
    const employee = await Employee.findOne({ email: email });

    if (!employee) {
      return res.status(404).json({ msg: 'Invalid User' });
    }

    // Compare the provided password with the employee's hashed password
    const isMatch = await bcrypt.compare(password, employee.password);


    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Password" });
    }

    // Create token using the employee's ID
    const token = createToken(employee._id);
    res.status(201).json({ msg: "Logged-in Successfully", token, employee });
  } catch (e) {
    console.log(e);
    res.status(401).json({ err: "Something went wrong!", e });
  }
};


exports.getEmployeeById = async (req, res) => {

  try {
    const tenantId = req.params.tenantID;
    const employeeId = req.params.employeeID;

    const Employee = await getEmployeeModel(employeeId);
    const employee = await Employee.findById(tenantId).populate({
      path: 'marketplace',
      populate: {
        path: 'product' 
      }
    })
      .exec();

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    return res.status(200).json({ msg: "Success", employee });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to fetch employee" });
  }
};


exports.updateEmployeeRewards = async (req, res) => {
console.log("----",req.body)
  try {
    const tenantId = req.params.tenantID; // Tenant ID from request parameters
    const employeeId = req.params.employeeID; // Employee ID from request parameters
    const { rewardPoints,rewardsIncrease } = req.body; // The new rewards value from request body

    
    // Get the tenant-specific employee model
    const Employee = await getEmployeeModel(tenantId);

    // Find the employee by ID
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

     // Update fields only if they are provided in the request body
     if (rewardPoints !== undefined) {
      employee.rewardPoints = rewardPoints;
    }
    if (rewardsIncrease !== undefined) {
      employee.rewardsIncrease = rewardsIncrease;
    }

    // Save the updated employee data
    await employee.save();

    return res.status(200).json({
      msg: "Employee rewards added successfully",
      employee,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Failed to update employee rewards" });
  }
};


exports.updateEmployeeRecommendedProducts = async (req, res) => {
  try {
    const tenantId = req.params.tenantID; // Tenant ID from request parameters
    const employeeId = req.params.employeeID; // Employee ID from request parameters
    const { marketplace,firstTimeLogin } = req.body; // The new marketplace ObjectId array from request body

    // Check if marketplace array is provided and is an array
    if (!marketplace || !Array.isArray(marketplace)) {
      return res.status(400).json({ msg: "Marketplace IDs should be provided as an array" });
    }

    // Convert marketplace IDs to ObjectId
    const marketplaceObjectIds = marketplace.map(id => new mongoose.Types.ObjectId(id));

    // Retrieve tenant-specific Marketplace model
    const Marketplace = await MarketplacePro(tenantId);

    // Validate each marketplace ID
    const validMarketplaces = await Marketplace.find({ _id: { $in: marketplaceObjectIds } });
    if (validMarketplaces.length !== marketplace.length) {
      return res.status(400).json({ msg: "One or more Marketplace IDs do not exist" });
    }

    // Retrieve the employee model for the specific tenant
    const Employee = await getEmployeeModel(tenantId);
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

        // Update the employee's marketplace and firstTimeLogin fields if provided
        if (marketplace) {
          employee.marketplace = marketplaceObjectIds;
        }
    
        if (typeof firstTimeLogin === 'boolean') {
          employee.firstTimeLogin = firstTimeLogin;
        }

    // Save the updated employee data
    await employee.save();

    return res.status(200).json({
      msg: "Employee marketplace updated successfully",
      employee,
    });
  } catch (error) {
    console.error("Error updating employee marketplace:", error);
    return res.status(500).json({ msg: "Failed to update employee marketplace" });
  }
};


exports.updateEmployeeSkills = async (req, res) => {
  try {
    const tenantId = req.params.tenantID;
    const employeeId = req.params.employeeID;
    const { skills } = req.body;

    // Validate skills input
    if (!Array.isArray(skills)) {
      return res.status(400).json({ msg: "Skills must be an array" });
    }

    // Get the tenant-specific employee model
    const Employee = await getEmployeeModel(tenantId);
    if (!Employee) {
      return res.status(404).json({ msg: "Employee model not found for tenant" });
    }

    // Find the employee by ID
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    // Overwrite the employee's skills with the new skills
    employee.empSkills = skills;

    // Save the updated employee data
    const savedEmployee = await employee.save();
    if (!savedEmployee) {
      return res.status(500).json({ msg: "Failed to save updated skills" });
    };

    return res.status(200).json({
      msg: "Employee skills updated successfully",
      employee: savedEmployee,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to update employee skills" });
  }
};



