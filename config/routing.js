const SubmitRouter = require("../routers/submitRouter");
const authenticateRouter = require("../routers/Authenticate");

const setupRouting = (app) => {
  console.log("Setting up routes.");
  app.use("/api/v1/submit", SubmitRouter);
  app.use("/auth", authenticateRouter);
};

module.exports = setupRouting;