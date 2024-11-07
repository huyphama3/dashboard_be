const express = require('express');
const { getEmployees, getNameEmployees, getLa} = require('../controllers/employeesController');


//router object
const router = express.Router();

//router
router.get("/getall",getEmployees);
router.get("/getname",getNameEmployees);
router.get("/getLa",getLa);
module.exports = router;