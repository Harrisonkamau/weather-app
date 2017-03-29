var Router = require('koa-router');
var ip = require('ip');
var request = require('request');
var weather = require('openweather-apis');

// set /api prefix for all routes
var router = new Router({ prefix: '/api' });

// Local modules
var config = require('../config/config');

/*
 ==================================
   Routing End Points
 ==================================
*/
router.get('/', async (ctx) => {
  ctx.body = 'Welcome home!';
});

// GET ip address
router.get('/ip', async (ctx, next) => {
  ctx.body = {
    ip: getMyIP()
  }
  // Invoke the downstream middleware
  await next();
})

// GEO Locate my_ip
router.get('/location', async (ctx, next) => {
  // Initialize the getCoordinates Promise function
  return getCoordinates().then(function (result) {
    const latitude = result.lat;
    const longitude = result.lon;
    // console.log(latitude, longitude);

    // respond with a JSON object
    ctx.body = {
      lat: latitude,
      lon: longitude
    };
  })
  // Invoke the downstream middleware
  await next();
})

// GET Weather data
router.get('/weather', async (ctx) => {
  return getCoordinates().then(function (result) {

    // Weather constant variables
    const WEATHER_API_KEY = config.API_KEY;
    const lat = result.lat;
    const lon = result.lon;
    const APPID = weather.setAPPID(WEATHER_API_KEY)

    // openweathera-apis setting
    weather.setLang('en');
    weather.setCoordinate(lat, lon);

    // Get the whole weather JSON object
    weather.getAllWeather(function (err, data) {
      if (err) console.error(err)
      ctx.body = 'hello'
    });
  })

})

/*
 =====================================
  Routing helpers - Private functions
 =====================================
*/
function getMyIP() {
  return ip.address();
}

// Use a Promise to get coordinates from the response body
function getCoordinates() {
  return new Promise(function (resolve, reject) {
    // get ip address
    var myIP = getMyIP();

    // create an options object to be used by Request HTTP client
    var options = {
      url: "http://ip-api.com/json",
      query: myIP
    }

    request(options, function (err, res) {
      if (err) {
        reject(err);
      } else {
        const coordinates = JSON.parse(res.body);
        resolve(coordinates);
      }

    })
  })
}


// Modules for export
module.exports = router;