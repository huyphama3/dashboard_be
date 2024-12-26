const db = require("../config/db");
const oracledb = require("oracledb");
const moment = require('moment');


class Submit{

  async submitData(req, res) {

    const {
        fileDate,
        issueDate,
        empName,
        donVi,
        empEmail,
        touchCompanyInfo,
        touchCompanyContact,
        touchCompanyPhone,
        solutionName,
        companyName,
        contractRevenue,
        fiberCode,
        fiberCompanyName,
        fiberRevenue,
        prepaidPhoneNumber,
        prepaidSubscriptionPackage,
        prepaidRevenue,
        postpaidPhoneNumber,
        postpaidSubscriptionPackage,
        postpaidRevenue,
        otherServiceName,
        otherServiceRevenue,
      } = req.body;

// Kiểm tra các trường bắt buộc
if (!fileDate || !issueDate || !empName || !donVi || !empEmail) {
  return res.status(400).json({
    msg: "Vui lòng điền đầy đủ thông tin bắt buộc!",
    missingFields: {
      fileDate: !fileDate ? "Thiếu FILE_DATE" : null,
      issueDate: !issueDate ? "Thiếu ISSUE_DATE" : null,
      empName: !empName ? "Thiếu EMP_NAME" : null,
      donVi: !donVi ? "Thiếu DON_VI" : null,
      empEmail: !empEmail ? "Thiếu EMP_EMAIL" : null,
    },
  });
}

    // Chuyển đổi định dạng ngày tháng nếu có giá trị
    const formattedFileDate = fileDate ? moment(fileDate, "DD/MM/YYYY").format("DD-MMM-YY") : moment().format("DD-MMM-YY");
    const formattedIssueDate = issueDate ? moment(issueDate, "DD/MM/YYYY").format("DD-MMM-YY") : moment().format("DD-MMM-YY");


    const sql = `
      INSERT INTO KPI_EMP_CV (
        FILE_DATE, ISSUE_DATE, EMP_NAME, DON_VI, EMP_EMAIL, TOUCH_COMPANY_INFO, 
        TOUCH_COMPANY_CONTACT, TOUCH_COMPANY_PHONE, GPCNTT_SOLUTION_NAME, 
        GPCNTT_COMPANY_NAME, GPCNTT_CONTRACT_REVENUE, FIBER_CODE, 
        FIBER_COMPANY_NAME, FIBER_REVENUE, PREPAID_PHONE_NUMBER, 
        PREPAID_SUBSCRIPTION_PACKAGE, PREPAID_REVENUE, POSTPAID_PHONE_NUMBER, 
        POSTPAID_SUBSCRIPTION_PACKAGE, POSTPAID_REVENUE, OTHER_SERVICE_NAME, 
        OTHER_SERVICE_REVENUE
      ) VALUES (
        TO_DATE(:fileDate, 'DD/MM/YYYY'), TO_DATE(:issueDate, 'DD/MM/YYYY'), :empName, :donVi, :empEmail, :touchCompanyInfo, 
        :touchCompanyPhone, :touchCompanyContact, :solutionName, :companyName, :contractRevenue, 
        :fiberCode, :fiberCompanyName, :fiberRevenue, :prepaidPhoneNumber, 
        :prepaidSubscriptionPackage, :prepaidRevenue, :postpaidPhoneNumber, 
        :postpaidSubscriptionPackage, :postpaidRevenue, :otherServiceName, 
        :otherServiceRevenue
      )`;


    const binds = {
        fileDate: formattedFileDate,
        issueDate: formattedIssueDate,
        empName,
        donVi,
        empEmail: empEmail || null,
        touchCompanyInfo: touchCompanyInfo || null,
        touchCompanyPhone: touchCompanyPhone || null,  // Gán null nếu không có giá trị
        touchCompanyContact: touchCompanyContact ||null,
        solutionName: solutionName || null,
        companyName: companyName || null,
        contractRevenue: contractRevenue || null,  // Nếu không có giá trị, gán null
        fiberCode: fiberCode || null,
        fiberCompanyName: fiberCompanyName || null,
        fiberRevenue: fiberRevenue || null,
        prepaidPhoneNumber: prepaidPhoneNumber || null,
        prepaidSubscriptionPackage: prepaidSubscriptionPackage || null,
        prepaidRevenue: prepaidRevenue || null,
        postpaidPhoneNumber: postpaidPhoneNumber || null,
        postpaidSubscriptionPackage: postpaidSubscriptionPackage || null,
        postpaidRevenue: postpaidRevenue || null,
        otherServiceName: otherServiceName || null,
        otherServiceRevenue: otherServiceRevenue || null
      };
  
    let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true,
      prefetchRows: 500,
      fetchArraySize: 500,
    };
  
    let connection;
  
    try {
      connection = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONN_STRING,
      });
        const result = await connection.execute(sql, binds, { autoCommit: true });
  
        res.json({ message: "Dữ liệu đã được thêm vào thành công.", rowsAffected: result.rowsAffected });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Đã xảy ra lỗi khi thêm dữ liệu.", error: error.toString() });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
            console.log("Error in closing Oracle connection:", error);
        }
      }
    }
  };

}
module.exports = new Submit();