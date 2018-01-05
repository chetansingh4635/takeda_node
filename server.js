"use strict";
const express     	 = require('express');
const app         	 = express();
const bodyParser 	   = require('body-parser');
const cors        	 = require('cors');
const jwt            = require('jsonwebtoken');
var expressValidator = require('express-validator');
var bunyan           = require('bunyan');
var bunyanMiddleware = require('bunyan-middleware');
var bunyanLogger     = bunyan.createLogger({name:'tryMe', streams: [{path: 'tryMe.log'}]});
global.configs       = require('./configs.json');
var witModel         = require('./models/witModel');
const fs             = require('fs');
var multer           = require('multer');

/**
* This block of code is use for to configure application level middlewares
*/
app.use(bunyanMiddleware(bunyanLogger)) // Configure bunyan logger for track user API actions in log file
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator([]));
app.use(cors());
app.use(express.static(__dirname + 'public')); //setup static public directory
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs'); // Configure ejs as view engine for rendring html templates
app.use(multer({ storage :
	multer.diskStorage({
		destination: function (req, file, cb) { cb(null, 'uploads/')}
	})
}).any());

/**
* This middleware is use for to enable cores for all incomming API calls
*/
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

/**
* This middleware is use for to define the error
*/
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(401).json({error: 'Something wrong with request'});
});

/**
* These middlewares is use for define module wise rounting
*/
app.use('/v' + configs.version + '/',    require('./routes/brandingRoute.js'))        //Call all branding API routes
app.use('/v' + configs.version + '/',    require('./routes/documentRoute.js')) 				//Call all document API routes
app.use('/v' + configs.version + '/',    require('./routes/userValidationRoute.js')); //Call all user API routes
app.use('/v' + configs.version + '/wit', require('./routes/witRoute.js'));            //Call all wit API routes

/**
* Creating Unit Test Doc Server Response HTML
*/
app.get('/unitTestReport',function(req,res){
  res.sendFile(__dirname +'/unitTestReport/report.html');
});

fs.readdir('unitTestReport/assets', (err, files) => {
  files.forEach(file => {
    console.log(file);
    app.get('/assets/'+file,function(req,res){
        res.sendFile(__dirname +'/unitTestReport/assets/'+file);
    });
  });
});

/**
* Application running on given port
*/
app.listen(configs.appPort);
console.log('REST API is runnning at ' + configs.appPort);
