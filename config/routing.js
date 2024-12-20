
const SubmitRouter = require("../routers/submitRouter")

const setupRouting = (app) => {
  console.log("Setting up routes.");
  app.use("/api/v1/submit", SubmitRouter);

};

module.exports = setupRouting;
