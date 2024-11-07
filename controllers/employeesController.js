const db = require("../config/db");
const oracledb = require("oracledb");

const getEmployees = async (req, res) => {
    //logic lấy api tất cả nhân viên
    const sql = "SELECT * FROM thong_tin_nhan_vien";
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
        connection = await oracledb.getConnection(process.env.POOL_ALIAS);

    const stream = connection.queryStream(sql, binds, options);

    const consumeStream = new Promise((resolve, reject) => {
      let data = {};
      let rows = [];

      stream.on("error", function (error) {
        console.log("Stream error:", error);
        reject(error);
      });

      stream.on("metadata", function (metadata) {
        data.metaData = metadata;
      });

      stream.on("data", function (data) {
        rows.push(data);
      });

      stream.on("end", function () {
        stream.destroy();
      });

      stream.on("close", function () {
        // data.rows = rows;
        resolve(rows);
      });
    });

    const data = await consumeStream;

    res.json(data);
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

// lấy tên nhân viên 
const getNameEmployees = async (req, res) => {
  //logic lấy api tên nhân viên
  const sql = "SELECT Ho_Ten FROM thong_tin_nhan_vien";
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
      connection = await oracledb.getConnection(process.env.POOL_ALIAS);

  const stream = connection.queryStream(sql, binds, options);

  const consumeStream = new Promise((resolve, reject) => {
    let rows = [];

    stream.on("error", function (error) {
      console.log("Stream error:", error);
      reject(error);
    });

    stream.on("data", function (data) {
      rows.push(data.HO_TEN); // Lấy chỉ tên (HO_TEN)
    });

    stream.on("end", function () {
      stream.destroy();
    });

    stream.on("close", function () {
      resolve(rows); // Trả về mảng chỉ chứa tên
    });
  });

  const data = await consumeStream;

  res.json(data);
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

const getLa = async (req, res) => {
  // Sử dụng câu lệnh SQL với tên bảng KPI_THU_VIEC trong schema An_Owner
  const sql = `
    SELECT ISSUE_DATE, TOUCH_COMPANY_INFO, TOUCH_COMPANY_PHONE, GPCNTT_SOLUTION_NAME, GPCNTT_CONTRACT_VALUE
    FROM An_Owner.KPI_THU_VIEC
    WHERE EMP_NAME = :empName
  `;

  // Tham số truy vấn, có thể lấy tên nhân viên từ query parameter
  let binds = {
    empName: req.query.empName || 'Bùi Trọng La', // Mặc định là 'Bùi Trọng La'
  };

  // Tùy chọn cho truy vấn
  let options = {
      outFormat: oracledb.OUT_FORMAT_OBJECT,
      autoCommit: true,
      prefetchRows: 500,
      fetchArraySize: 500,
      resultSet: true,
    };
  
  let connection;

  try {
    // Kết nối đến Oracle Database
    connection = await oracledb.getConnection(process.env.POOL_ALIAS);
    
    // Thực hiện truy vấn với stream để tối ưu hóa việc xử lý dữ liệu lớn
    const stream = connection.queryStream(sql, binds, options);

    const consumeStream = new Promise((resolve, reject) => {
      let rows = [];

      // Xử lý lỗi nếu có trong quá trình streaming
      stream.on("error", function (error) {
        console.log("Stream error:", error);
        reject(error);
      });

      // Lưu dữ liệu vào mảng rows
      stream.on("data", function (data) {
        rows.push(data); // Lưu từng dòng dữ liệu vào mảng rows
      });

      // Khi stream kết thúc, hủy stream
      stream.on("end", function () {
        stream.destroy();
      });

      // Khi stream đóng, trả dữ liệu về cho client
      stream.on("close", function () {
        resolve(rows);
      });
    });

    const data = await consumeStream;
    res.json(data); // Trả dữ liệu về client

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: error.toString() });
  } finally {
    if (connection) {
      try {
        console.log("Returning connection into the pool");
        await connection.close();
      } catch (error) {
        console.log("Error in closing oracledb connection:", error);
        throw error;
      }
    }
  }
};


module.exports = {getEmployees, getNameEmployees, getLa};