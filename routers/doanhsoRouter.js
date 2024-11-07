const express = require('express');
const {getDoanhSo} = require("../controllers/doanhsoController")

// router object
const router = express.Router();

// Thiết lập route cho doanh số
router.get("/get", getDoanhSo); // Định nghĩa route GET để lấy doanh số

module.exports = router;
