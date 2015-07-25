/**
 * Created by pixel on 23/07/2015.
 */
var express = require('express');
var router = express.Router();

router.get('/', function(){

});

router.all(/^(?!\/api).*$/, useAngular);