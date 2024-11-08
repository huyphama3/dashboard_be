const db = require("../config/db");
const oracledb = require("oracledb");


const getDoanhSo = async (req, res) => {
    //logic lấy api tất cả nhân viên
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
        connection = await oracledb.getConnection(process.env.POOL_ALIAS);

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

    res.json({ data: doanhSoArray }); // Trả về dữ liệu dưới dạng mảng doanh số
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



module.exports = {getDoanhSo};