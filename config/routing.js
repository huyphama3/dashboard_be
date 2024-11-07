const EmployeesRoutes = require("../routers/employeesRouter");
const DoanhSoRouters = require("../routers/doanhsoRouter");

const setupRouting = (app) => {
  console.log("Setting up routes.");
  app.use("/api/v1/employees", EmployeesRoutes); // Thiết lập route cho nhân viên
  app.use("/api/v1/doanhso", DoanhSoRouters);
};

module.exports = setupRouting;
