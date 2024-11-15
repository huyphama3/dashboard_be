const db = require("../config/db");
const oracledb = require("oracledb");


class EmployeeKPIController {


  async getEmployees(req, res) {
    const sql = "SELECT * FROM KPI_EMP_CV";
    let binds = {};
  
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
      const result = await connection.execute(sql, binds, options);
  
      console.log("Employee data:", result.rows); // Ghi log kết quả
      res.json(result.rows); // Trả về mảng kết quả
    } catch (error) {
      console.log("Error in getEmployees:", error); // Ghi log chi tiết lỗi
      res.status(500).json({ msg: error.toString() });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.log("Error in closing connection:", error);
        }
      }
    }
  };
  
  async getNameEmployees(req, res) {
    const sql = 'SELECT EMP_NAME FROM KPI_EMP_CV';
    let binds = {};
  
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
      const result = await connection.execute(sql, binds, options);
  
      const names = result.rows.map(row => row.EMP_NAME);
      console.log("Employee names:", names); // Ghi log kết quả
      res.json(names); // Trả về mảng tên nhân viên
    } catch (error) {
      console.log("Error in getNameEmployees:", error); // Ghi log chi tiết lỗi
      res.status(500).json({ msg: error.toString() });
    } finally {
      if (connection) {
        try {
          await connection.close();
        } catch (error) {
          console.log("Error in closing connection:", error);
        }
      }
    }
  };

}
module.exports = new EmployeeKPIController();