/**
 * Created by pixel on 23/07/2015.
 */

    'use strict';

var config = require('../config'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    path = require('path'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    favicon = require('serve-favicon'),
    helmet = require('helmet'),
    csrf = require('csurf'),
    logger = require('morgan');

var app = express();


// config file
app.config = config;

app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function(){/* db connected */});

//settings
app.disable('x-powered-by');
app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

app.use(require('morgan')('dev'));
app.use(require('compression')());
//app.use(require('serve-static')(path.join(__dirname, '../public')));
app.use(require('method-override')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(config.cryptoKey));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.cryptoKey,
    store: new mongoStore({ url: config.mongodb.uri })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(csrf({
    cookie: {signed: true}
}));
app.use(function (req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.locals.csrftoken = req.csrfToken();
    next();
});
helmet(app);

//config i18n
var i18n = require('./lang')(app);

//response locals
app.use(function(req, res, next) {
    res.cookie('_csrfToken', req.csrfToken());
    res.locals.user = {};
    res.locals.user.defaultReturnUrl = req.user && req.user.defaultReturnUrl();
    res.locals.user.username = req.user && req.user.username;
    res.locals.user.lang = req.user && req.user.lang;
    next();
});

//global locals
app.locals.projectName = app.config.projectName;
app.locals.copyrightYear = new Date().getFullYear();
app.locals.copyrightName = app.config.companyName;
app.locals.projectLogo = app.config.projectLogo;
app.locals.cacheBreaker = 'br34k-01';

require('./passport');
require('./routs')(app, passport);

//setup utilities
app.utility = {};
app.utility.sendmail = require('./util/sendmail');
app.utility.slugify = require('./util/slugify');
app.utility.workflow = require('./util/workflow');
app.utility.validator = require('validator');


module.exports = app;
