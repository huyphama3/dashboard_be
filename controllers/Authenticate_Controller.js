const jwt = require("jsonwebtoken");
const ldap = require("ldapjs");
require("dotenv").config();

class Authenticate_Controller {
  index(req, res) {
    const { username, password } = req.body;

    if (username && password) {
      const user = { name: username };

      const client = ldap.createClient({
        url: process.env.LDAP_URI,
        timeout: 5000,
        connectTimeout: 10000,
      });

      client.bind(username, password, (err) => {
        client.unbind();
        if (err) {
          console.error("LDAP Bind Error:", err);
          res.status(401).json({ message: "Invalid username or password" });
        } else {
          const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "10d",
          });
          res.json({ accessToken, username });
        }
      });
    } else {
      res.status(400).json({ message: "Username and password are required" });
    }
  }
}

module.exports = new Authenticate_Controller();
