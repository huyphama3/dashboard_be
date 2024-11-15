const express = require('express');
const {submitData} = require('../controllers/submitController');


//router object
const router = express.Router();

//router
router.post("/guidulieu",submitData);
module.exports = router;