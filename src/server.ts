const app = require('./index');
require("dotenv").config()
let server; 

server=app.listen(process.env.PORT || 4000);
module.exports = server

