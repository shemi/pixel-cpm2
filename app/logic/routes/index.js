/**
 * Created by pixel on 23/07/2015.
 */

'use strict';

var express = require('express');
var router = express.Router();
var helpers = require('./functions');

router.get('/*', function(req, res, next){
    res.setHeader('Last-Modified', (new Date()).toUTCString());
    next();
});

//preAuth
router = require('./preAuth')(router, helpers);

router.get('/emailtest', function(req, res, next){
    res.render('emailtest/register');
});

router.all(/^(?!\/(api|signup|login|account-recovery|test)).*$/, helpers.ensureAuthenticated);
router.all(/^(?!\/(api|signup|login|account-recovery|test)).*$/, helpers.useAngular);

module.exports = router;