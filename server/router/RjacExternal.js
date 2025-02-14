const express = require('express');
const { getSomeInfo } = require('../controller/RjacExternal');
const {isAuthenticateAdmin} = require('../controller/admin')


const Router  = express.Router()



Router.get('/someINFO/:id'
// ,isAuthenticateAdmin
,getSomeInfo)


module.exports = Router;
