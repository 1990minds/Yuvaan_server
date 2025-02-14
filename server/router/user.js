const express = require('express')

const{createUser,getAllUser,getOneUser,login,updateUser,deleteUser, isAuthenticateUser, userProfile} = require("../controller/user")

const router = express.Router()

router.post('/user', createUser)
router.post('/userAuth',login)
router.get('/userAll',getAllUser)
router.get('/userOne/:id',getOneUser)
router.put('/user/:id',updateUser)
router.delete('/user/:id',deleteUser)
router.get('/userProfile',isAuthenticateUser,userProfile)

module.exports = router