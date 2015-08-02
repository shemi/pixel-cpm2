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
        email;

    //var deferred = Q.defer();

    var getTemplate = function(){
        var defer = Q.defer();

        var templateName = options.template.name || 'default';
        var templatePath = path.join(__dirname, './templates', templateName, 'index.jade');

        if(!fs.existsSync(templatePath)){
            defer.reject('file not exist');
        }else{
            defer.resolve(templatePath);
        }

        return defer.promise;
    };

    var renderTemplate = function(templatePath){
        var defer = Q.defer();
        var compile = jade.compileFile(templatePath,
            {

            }
        );
        defer.resolve(compile);
        return defer.promise;
    };

    getTemplate().then(
        function(path){
            return renderTemplate(path);
        },
        function(err){
            res.send('err');
            var error = new Error(err);
            console.log(error);
        }
    ).then(
        function(renderFunction){
            var render = renderFunction({
                content: {
                    title: 'anhini',
                    lead: 'loram ipsumloram ipsumloram ipsumloram ipsum loram ipsumloram ipsum loram ipsumloram ipsum',
                    paragraphs: [
                        'loram ipsumloram ipsumloram ipsumloram ipsum loram ipsumloram ipsum loram ipsumloram ipsum'
                    ]
                }
            });
            res.send(render);
        }
    );

    //res.send('test Ok');

    //return deferred.promise;

};