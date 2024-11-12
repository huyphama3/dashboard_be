const db = require("../config/db");
const oracledb = require("oracledb");


class KPIController {

  async getDoanhSo(req, res) {
    const sql = "SELECT DOANH_SO FROM doanh_so_kpi";
    let binds = {};

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
        // Chỉ lấy doanh số từ các dòng trả về
        rows.push(data.DOANH_SO);
    });

    stream.on("end", function () {
        stream.destroy();
    });

    stream.on("close", function () {
        resolve(rows);
    });


    });

    // Lấy kết quả từ stream và trả về dưới dạng mảng doanh số
    const doanhSoArray = await consumeStream;

    res.json(doanhSoArray); // Trả về dữ liệu dưới dạng mảng doanh số
      } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.toString() });
      } finally{
        if(connection){
            try {
                console.log("Returning connection into the pool");
                await connection.close();
            } catch (error) {
                console.log("Error in closing oracledb connection:", error);
                throw error;
            }
        }
      }



  }

  async getThongTinHopDong(req, res) {
    const sql = `
      SELECT ISSUE_DATE, TOUCH_COMPANY_INFO, TOUCH_COMPANY_PHONE, GPCNTT_SOLUTION_NAME, GPCNTT_CONTRACT_VALUE
      FROM An_Owner.KPI_THU_VIEC
      WHERE EMP_NAME = :empName
    `;

    // Lấy tên nhân viên từ query (mặc định là 'Bùi Trọng La' nếu không có tham số)
    const empName = req.query.empName || 'Bùi Trọng La';

    let binds = {
      empName: empName,
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

module.exports = new KPIController();
