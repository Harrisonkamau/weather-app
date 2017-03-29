// load env variables
require('dotenv').config();

module.exports = {
  port: process.env.PORT,
  API_KEY: process.env.API_KEY
}
