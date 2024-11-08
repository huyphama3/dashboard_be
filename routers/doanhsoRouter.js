const express = require('express');
const {getDoanhSo, index} = require("../controllers/doanhsoController")

// router object
const router = express.Router();

// Thiết lập route cho doanh số
router.get("/get", getDoanhSo); // Định nghĩa route GET để lấy doanh số
router.get("/test1", index);
module.exports = router;
