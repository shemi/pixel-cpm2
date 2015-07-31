/**
 * Created by pixel on 27/07/2015.
 */

'use strict';

module.exports = function(app){
    var i18n = require('i18n-2'),
        path = require('path'),
        locale = require('locale');

    app.use(locale(app.config.lang.locales));

    i18n.expressBind(app, {
        locales: app.config.lang.locales,
        defaultLocale: app.config.lang.defaultLocale,
        cookieName: app.config.lang.cookieName,
        extension: app.config.lang.extension,
        directory: app.config.lang.directory
    });

    app.getUserLocal = function(req){
        if(req.isAuthenticated() && res.user.lang){
            return req.user.lang;
        }else if(req.cookies[req.app.config.lang.cookieName]) {
            return req.cookies[app.config.lang.cookieName].toLowerCase();
        }else{
            return req.locale;
        }
    };

    // set up the middleware
    app.use(function(req, res, next) {
        var userLocal = app.getUserLocal(req, res).toLowerCase();
        if(!req.cookies[app.config.lang.cookieName] || req.cookies[app.config.lang.cookieName].toLowerCase() !== userLocal){
            res.cookie('locale', userLocal);
            req.i18n.setLocale(userLocal);
        }
        req.i18n.setLocaleFromCookie();
        next();
    });

    return i18n;
};