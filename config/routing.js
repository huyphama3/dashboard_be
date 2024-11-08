const DoanhSoRouters = require("../routers/doanhsoRouter");
const EmployeeKPIController = require("../routers/employeesRouter") 
const KPIController = require("../routers/doanhsoRouter")
const setupRouting = (app) => {
  console.log("Setting up routes.");
  app.use("/api/v1/employees", EmployeeKPIController); // Thiết lập route cho nhân viên
  app.use("/api/v1/doanhso", KPIController);
};

module.exports = setupRouting;
