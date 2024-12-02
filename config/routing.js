const EmployeeKPIController = require("../routers/employeesRouter") 
const KPIController = require("../routers/doanhsoRouter")
const SubmitRouter = require("../routers/submitRouter")
const AuthenticateRouter = require("../routers/Authenticate")
const setupRouting = (app) => {
  console.log("Setting up routes.");
  app.use("/api/v1/employees", EmployeeKPIController); // Thiết lập route cho nhân viên
  app.use("/api/v1/doanhso", KPIController);
  app.use("/api/v1/submit", SubmitRouter);
  app.use("/api/v1/auth", AuthenticateRouter);
};

module.exports = setupRouting;
