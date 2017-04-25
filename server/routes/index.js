// Require modules from the NPM registry
let Router = require('koa-router');
let ip = require('ip');
let request = require('request');
let weather = require('openweather-apis');

// set /api prefix for all routes
const router = new Router({ prefix: '/api' });

// Local modules
const config = require('../config/config');

/*
 ==================================
   Routing End Points
 ==================================
*/

// Get home page: GET /api/
router.get('/', async (ctx) => {
  ctx.body = 'Welcome home! Visit either: /ip, /location or /weather to see the magic :-o';
});

// GET ip address: GET /api/ip
router.get('/ip', async (ctx, next) => {
  ctx.body = {
    ip: _getMyIP()
  }
  // Invoke the downstream middleware
  await next();
})

// GEO Locate my_ip: GET /api/location
router.get('/location', async (ctx, next) => {
  // Initialize the getCoordinates Promise function
  return _getCoordinates().then(function (result) {
    const latitude = result.lat;
    const longitude = result.lon;

    // respond with a JSON object
    ctx.body = {
      lat: latitude,
      lon: longitude
    };
  })
  // Invoke the downstream middleware
  await next();
})

// GET Weather data: GET /api/weather
router.get('/weather', async (ctx, next) => {
  // re-call the Promise to get Geolocation
  return _getCoordinates().then((result) => {
    // Define Weather constant variables
    const WEATHER_API_KEY = config.API_KEY;
    const lat = result.lat;
    const lon = result.lon;  

    // openweathera-apis settings
    weather.setLang('en'); //set language
    weather.setCoordinate(lat, lon); // set coordinates
    weather.setAPPID(WEATHER_API_KEY)  // set APPID 

    return new Promise((resolve, reject) => {
      // Get all the JSON file returned from server
      weather.getAllWeather((err, data) => {
        if (err) {
          reject(err);
        } else {
          let dataObj = {
            coordinates: data.coord,
            weather: data.weather,
            temperature: data.main.temp,
            humidity: data.main.humidity,
            city: data.name,
            weatherCode: data.cod,
            country: data.sys.country
          }
          // return the data object in the ctx.response.body
          ctx.body = dataObj;
          resolve(ctx.body);
        }
      })
    })

  })
})


/*
 =====================================
  Routing helpers - Private functions
 =====================================
*/

// get user's IP address
function _getMyIP() {
  return ip.address();
}

// Use a Promise to get coordinates from the response body
function _getCoordinates() {
  return new Promise(function (resolve, reject) {
    // get ip address
    var myIP = _getMyIP();

    // create an options object to be used by Request HTTP client
    var options = {
      url: "http://ip-api.com/json",
      query: myIP
    }

    // use Request() to make http calls to ip-api and send data as a JSON object
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