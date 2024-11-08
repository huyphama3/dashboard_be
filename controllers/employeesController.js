const db = require("../config/db");
const oracledb = require("oracledb");


class EmployeeKPIController {


  async getEmployees(req, res) {
    const sql = "SELECT * FROM thong_tin_nhan_vien";
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
    const sql = 'SELECT Ho_Ten FROM thong_tin_nhan_vien';
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
  
      const names = result.rows.map(row => row.HO_TEN);
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

  async getLa(req, res) {
    const sql = `
      SELECT ISSUE_DATE, TOUCH_COMPANY_INFO, TOUCH_COMPANY_PHONE, GPCNTT_SOLUTION_NAME, GPCNTT_CONTRACT_VALUE
      FROM An_Owner.KPI_THU_VIEC
      WHERE EMP_NAME = :empName
    `;

    let binds = {
      empName: req.query.empName || 'Bùi Trọng La',
    };

    let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true,
      prefetchRows: 500,
      fetchArraySize: 500,
      resultSet: true,
    };

    let connection;

    try {
      connection = await oracledb.getConnection({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONN_STRING,
      });
      
      const stream = connection.queryStream(sql, binds, options);

      const consumeStream = new Promise((resolve, reject) => {
        let rows = [];

        stream.on("error", function (error) {
          console.log("Stream error:", error);
          reject(error);
        });

        stream.on("data", function (data) {
          rows.push(data);
        });

        stream.on("end", function () {
          stream.destroy();
        });

        stream.on("close", function () {
          resolve(rows);
        });
      });

      const data = await consumeStream;
      res.json(data);
    } catch (error) {
      console.log("Database error:", error);
      res.status(500).json({ msg: error.toString() });
    } finally {
      if (connection) {
        try {
          console.log("Returning connection to the pool");
          await connection.close();
        } catch (error) {
          console.log("Error in closing the connection:", error);
        }
      }
    }
  }
}
module.exports = new EmployeeKPIController();