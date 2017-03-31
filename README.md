#Weather App Middleware built in Koa.js and Node.js
##To run the app locally:
clone the repo
```javascript
git clone git@bitbucket.org:kamauharrison/koa-weather.git 
// Or for https users
git clone https://kamauharrison@bitbucket.org/kamauharrison/koa-weather.git
```

Navigate in to the projects folder
```javascript
cd Downloads/koa-weather
```
Using NPM, install the project's dependencies
```javascript
npm install
```
Create an api account with [Open Weather Map](http://openweathermap.org/appid)

In your project's directory, create .env file to store your **API_KEY** and server **PORT**
```javascript
touch .env
```
The .env file should like similar to this:
```javascript
# Set default port
PORT=4000

# Open Weather Map API credentials
API_KEY='your_api_key'
```

To run the server, you'll need to have babel-cli installed
```javascript
npm install --save-dev babel-cli
```
Async/await isn’t natively supported in Node.js yet, even using the latest version (v6). So we'll use babel to transpile __tomorrow's__ JavaScript.

Create a **.babelrc** file and add the following
```javascript
{
    "plugins": [
      "transform-async-to-generator",
      "transform-es2015-modules-commonjs"
    ]
  }
```

Then add our first npm start script in package.json.
```javascript
  "scripts": {
   "start": "babel-node index.js"
  }
```
Now you can start the server
```javascript
npm start
```
Use Postman or chrome or Firefox
```javascript
http://localhost:4000/api/
```
Point to note!
**All routes have been prefixed with /api**
