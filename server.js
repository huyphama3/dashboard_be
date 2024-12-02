const express = require('express');
const colors =require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const setupRouting = require('./config/routing');
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
 app.listen(PORT, () => {
  console.log(`listen to post ${PORT}`);
});