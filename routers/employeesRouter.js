const express = require('express');
const {getEmployees, getNameEmployees, getThongTinHopDong} = require('../controllers/employeesController');


//router object
const router = express.Router();

//router
router.get("/getall",getEmployees);
router.get("/getName",getNameEmployees);
module.exports = router;