// =======================
// reference TDS files ============
// =======================

/// <reference path='../typings/tsd.d.ts' />

// =======================
// get the packages we need ============
// =======================

var express = require('express'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    expressSession = require('express-session'),
    mongoose = require('mongoose'),
    hash = require('bcrypt-nodejs'),
    path = require('path'),
    http = require('http'),
    passport = require('passport'),
    localStrategy = require('passport-local').Strategy,
    debug = require('debug')('passport-mongo');
    
    import passportConf from './auth/authConfig';
    import restrict from './auth/restrict';
// =======================
// Configration ============
// =======================

// create instance of express
var app = express();

// require routes
var account = require('./routes/account.js');
var post = require('./routes/post.js');

// define middleware
app.use(express.static(path.join(__dirname, '/../client')));
app.use(express.static(path.join(__dirname, '/../uploads')));
app.use('/favicon.ico', express.static(path.join(__dirname, '/../client/assets/images/favicon.ico')))

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passportConf();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

// =======================
// Routes ============
// =======================
app.use('/', account);
app.use('/post', post);

// error hndlers
/*interface Error {
    status?: number;
}
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    //err.status = 404;
    next(err);
});*/

/*app.use(function(err, req, res) {
	res.status(err.status || 500);
	res.end(JSON.stringify({
		message: err.message,
		error: {}
	}));
});
*/
// =======================
// Server Start ============
// =======================

app.set('port', (process.env.PORT || 3000));
var server = http.createServer(app);
server.listen(app.get('port'), 'localhost');
server.on('listening', function() {
	debug('Express server started on port %s at %s', server.address().port, server.address().address);
});




