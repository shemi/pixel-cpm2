/**
 * Created by shemi on 1 Aug 15.
 */

'use strict';

module.exports = function(req, res, options){

    options = options || {
            template: {
                name: 'default',
                title: '',
                locals: ''
            }
    };

    var Q  = require('q'),
        fs = require('fs'),
        path = require('path'),
        jade = require('jade'),
        juice = require('juice'),
        _ = require('underscore'),
        colors = require('colors'),
        email = {};

    var appConfig = req.app.config;
    var defaultLocals = {
        i18n: req.i18n,
        appLogo: appConfig.projectLogo,
        appName: req.i18n.__(appConfig.projectName),
        links: [
            {title: 'Terms', href: '#'},
            {title: 'Privacy', href: '#'},
            {title: 'Unsubscribe', href: '#'}
        ],
        socialTitle: req.i18n.__('Connect With Us:'),
        socialLinks: appConfig.socialLinks
    };

    var deferred = Q.defer();

    var getTemplate = function(){
        var defer = Q.defer();
        var templateName = options.template.name || 'default';
        var templatePath = path.join(__dirname, './templates', templateName, 'index.jade');
        var textTemplatePath = path.join(__dirname, './templates', templateName, 'text.jade');
        if(!fs.existsSync(templatePath)) {
            defer.reject('RenderEmail: [path] - The html template file not found (suppose to be in: '+ templatePath +').');
        } else if(!fs.existsSync(textTemplatePath)) {
            defer.reject('RenderEmail: [path] - The text template file not found (suppose to be in: '+ textTemplatePath +').')
        }else{
            defer.resolve([templatePath, textTemplatePath]);
        }
        return defer.promise;
    };

    var renderTemplate = function(templatePath){
        var defer = Q.defer();
        var compile = jade.compileFile(templatePath);
        defer.resolve(compile);
        return defer.promise;
    };


    var inlineCss = function(htmlString){
        var defer = Q.defer();
        var options = {
            preserveMediaQueries: true
        };
        juice.juiceResources(htmlString, options, function(err, html){
            if(err){
                defer.reject(err);
                return;
            }
            defer.resolve(html);
        });
        return defer.promise;
    };


    getTemplate()
    .then(function(path){
        return Q.all([
            renderTemplate(path[0]),
            renderTemplate(path[1])
        ]);
    }, function(err){
        throw new Error(err);
        return null;
    })

    .then(function(renderFunction){
        var userLocals = {
            content: {
                title: 'anhini',
                lead: 'loram ipsumloram ipsumloram ipsumloram ipsum loram ipsumloram ipsum loram ipsumloram ipsum',
                paragraphs: [
                    'loram ipsumloram ipsumloram ipsumloram ipsum loram ipsumloram ipsum loram ipsumloram ipsum',
                    'loram ipsumloram ipsumloram ipsumloram ipsum loram ipsumloram ipsum loram ipsumloram ipsum',
                ]
            },
            callout: req.i18n.__('If you received this email by mistake, simply delete it. You won\'t be subscribed if you don\'t click the confirmation link above.'),
        };
        var locals = _.extend(defaultLocals, userLocals);
        var renderHtml = renderFunction[0](locals);
        email.text = renderFunction[1](locals);
        return inlineCss(renderHtml);
    })

    .then(function(html){
            email.haml = html;
    }, function(err){
        throw new Error(err);
        return null;
    })

    .fail(function(err){
        console.log(colors.red(err));
        throw err;
    })

    .done(function(){
        deferred.resolve(email);
        res.send(email);
    }, function(err){
        deferred.reject(err);
        res.send('Email render: Something broke!');
    });

    return deferred.promise;
};