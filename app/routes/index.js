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


router.all(/^(?!\/api).*$/, helpers.ensureAuthenticated);
router.all(/^(?!\/api).*$/, function(req, res, next){
    res.render('preAuth/register/index');
});

module.exports = router;