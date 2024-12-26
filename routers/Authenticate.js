const express = require("express");
const router = express.Router();
const authenticateController = require("../controllers/Authenticate_Controller");

// Route xử lý POST /auth
router.post("/", authenticateController.index);

module.exports = router;
