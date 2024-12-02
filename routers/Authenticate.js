const express = require("express");
const router = express.Router();
const authenticateController = require("../controllers/Authenticate_Controller");
router.post("/", authenticateController.index);

module.exports = router;
