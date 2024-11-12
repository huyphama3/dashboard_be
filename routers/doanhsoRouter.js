const express = require('express');
const {getDoanhSo, getThongTinHopDong} = require("../controllers/doanhsoController")

// router object
const router = express.Router();

// Thiết lập route cho doanh số
router.get("/get", getDoanhSo);
router.get("/getThongTinHopDong",getThongTinHopDong); // Định nghĩa route GET để lấy doanh số
module.exports = router;
