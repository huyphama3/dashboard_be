const oracledb = require("oracledb");


const initConnectionPool = async () => {
    try {
      console.log(`Initializing connection pool to ${process.env.POOL_ALIAS}`);

      await oracledb.createPool({
        //_enableStats: true, // Default is false, enables console.log(pool._logStats())
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        connectString: process.env.DB_CONN_STRING,
        poolAlias: process.env.POOL_ALIAS, // Đặt một tên bí danh (alias) cho pool kết nối để dễ truy cập

      });
    } catch (error) {
      throw new Error("initConnectionPool() error: " + error.message);
    }
  };

  const closePoolAndExit = async () => {
    console.log("\nClosing connection");
    try {

      await oracledb.getPool(process.env.POOL_ALIAS).close(5);
      console.log("Connection pool closed");
      process.exit(0);
    } catch (err) {
      console.error("Error occured closing pools:", err.message);
    }
  };
  
  process
  .once("SIGTERM", closePoolAndExit)
  .once("SIGINT", closePoolAndExit)
  .once("SIGUSR2", closePoolAndExit)
  .once("restart", closePoolAndExit);
  
  module.exports = { initConnectionPool, closePoolAndExit };
