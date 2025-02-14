const express = require("express");

const employerrouter = express.Router();
const {
  createEmployer,
  login,
  employerProfile,
  isAuthenticateEmployer,
  getAllEmployers,
  getOneEmployer,
  updateEmployer,
  deleteEmployer,
  getAllSupEmployers,
  updateEmployerTour,
  getEmployernotauth,
} = require("../controller/employer");
const { isAuthenticateAdmin } = require("../controller/admin");
const { isAuthenticateUser } = require("../controller/user");

employerrouter.post("/employerByadmin", isAuthenticateAdmin, createEmployer);
employerrouter.post("/employerAuth", login);
employerrouter.get("/employerProfile", isAuthenticateEmployer, employerProfile);
employerrouter.get("/employerProfilnotauth/:id",  getEmployernotauth);

employerrouter.put("/employerauthenticate/:id",isAuthenticateEmployer,updateEmployer);
employerrouter.put("/employerTour/:id",isAuthenticateEmployer,updateEmployerTour);
employerrouter.put("/employer/:id", isAuthenticateAdmin, updateEmployer);

employerrouter.get("/getemployerAdmin", isAuthenticateAdmin, getAllEmployers);
employerrouter.get("/employer2/:id", isAuthenticateEmployer, getOneEmployer);
employerrouter.get("/employeradmin/:id", isAuthenticateAdmin, getOneEmployer);
employerrouter.delete("/employer/:id", isAuthenticateAdmin, deleteEmployer);

employerrouter.post("/employeruser1", isAuthenticateUser, createEmployer);
employerrouter.put("/employeruser/:id", isAuthenticateUser, updateEmployer);
employerrouter.get("/getemployeruser", isAuthenticateUser, getAllEmployers);
employerrouter.get("/employeruser2/:id", isAuthenticateUser, getOneEmployer);
employerrouter.delete("/employeruser3/:id", isAuthenticateUser, deleteEmployer);



//Suppliers Employers
employerrouter.post("/employerBySup", createEmployer);
employerrouter.put("/employerBySup/:id", updateEmployer);
employerrouter.post("/getemployerBySup", getAllSupEmployers);
employerrouter.get("/employerBySup/:id", getOneEmployer);
employerrouter.delete("/employerBySup/:id", deleteEmployer);

module.exports = employerrouter;
