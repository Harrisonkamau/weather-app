// Require modules from the NPM registry
var koa = require('koa');
var json = require('koa-json');

// create koa app
var app = new koa();
app.experimental = true

// Local imports
var router = require('./server/routes/index');
var config = require('./server/config/config');

// set app to use JSON pretty-printed response middleware
app.use(json());

// use the routes defined using the router
app.use(router.routes())
app.use(router.allowedMethods())

// Set default port
var port = config.port || 5000;

// start server
app.listen(port, () => {
  console.log("Server running on http://localhost:"+port);
})
