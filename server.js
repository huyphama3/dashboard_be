const express = require('express');
const colors =require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const oracledb = require('./config/db');
const {initOracleClient ,initConnectionPool, closePoolAndExit} = require('./config/db');
const setupRouting = require('./config/routing');
const employeesRouter = require('./routers/employeesRouter');
const cors = require('cors');



//configure dotenv
dotenv.config();

//middlewares
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//routes
setupRouting(app);

app.get("/test", (req, res) => {
    res.status(200).send("<h1> Running </h1>")
});

//port 
const PORT = process.env.PORT || 8110;


 // Test the connection
 initConnectionPool()
 .then(() => app.listen(PORT, console.log(`Server running on port ${PORT}`)))
 .catch((error) => {
   console.log(error);
   process.exit(1);
 });

