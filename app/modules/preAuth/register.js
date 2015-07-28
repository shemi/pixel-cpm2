/**
 * Created by pixel on 25/07/2015.
 */

'use strict';

module.exports = {
    init: function(req, res, next){
        if(req.isAuthenticated()){
            res.redirect('/');
        }else{
            //console.log(req.getLocale());
            res.render('preAuth/register/index', {
                oauthMessage: ''
            })
        }
    },
    register: function(req, res, next){
        var workflow = req.app.utility.workflow(req, res);
        var validate = req.app.utility.validator;
        var body = req.body;
        var fields = {};

        workflow.on('validate', function(){
            if(!body.firstname){
                workflow.outcome.errfor.firstname = 'required';
            }
            if(!body.lastname){
                workflow.outcome.errfor.lastname = 'required';
            }
            if(!body.email){
                workflow.outcome.errfor.email = 'required';
            }
            if(!validate.isEmail(body.email)){
                workflow.outcome.errfor.email = 'Invalid Email format';
            }
            if(!body.password){
                workflow.outcome.errfor.password = 'required';
            }
            if(!body.password.length() < 8){
                workflow.outcome.errfor.password = 'The password must contain at least 8 characters';
            }
            if(workflow.hasErrors()){
                return workflow.emit('response');
            }
            workflow.emit('duplicateEmailCheck');
        });

        workflow.on('sanitize', function(){
            fields.firstname = validate.escape(body.firstname);
            fields.lastname = validate.escape(body.lastname);
            fields.email = validate.normalizeEmail(body.email);
            fields.password = body.password;
            workflow.emit('duplicateEmailCheck');
        });

        workflow.on('duplicateEmailCheck', function(){
            req.app.db.models.User.findOne({ email: fields.email }, function(err, user){
                if(err){
                    return workflow.emit('exception', err);
                }

                if(user){
                    workflow.outcome.errfor.email = 'email already register';
                    return workflow.emit('response');
                }
                workflow.emit('createUserName');
            });
        });

        workflow.on('createUserName', function(){
            var username = fields.email.split('@');
            username = username[0];
            var num = 0;
            function checkIfExist(){
                req.app.db.models.User.findOne({ username: username }, function(err, user){
                    if(err){
                        return workflow.emit('exception', err);
                    }
                    if(user){
                        return randomNewUsernaem();
                    }
                    return finish();
                });
            }
            function randomNewUsernaem(){
                if(num === 0){
                    num = 3;
                }else{
                    num++;
                }
                var usernameExt = Math.floor(Math.random() * (num - 1 + 1)) + 1;
                username = username + usernameExt;
                return checkIfExist();
            }
            function finish(){
                fields.username = username;
                return workflow.emit('createUser');
            }
        });

        workflow.on('createUser', function(){
            req.app.db.models.User.hashPassword(fields.password, function(err, hash){
                if(err){
                    return workflow.emit('exception', err);
                }
                var fieldsToSet = {
                    isActive: 'yes',
                    username: fields.username,
                    email: fields.email,
                    password: hash,
                    search: [
                        fields.email,
                        fields.username
                    ]
                };
                req.app.db.models.User.create(fieldsToSet, function(err, user){
                    if(err){
                        return workflow.emit('exception', err);
                    }

                    workflow.user = user;
                    workflow.emit('createAccount');
                });
            });
        });

        workflow.on('createAccount', function(){
            var fieldsToSet = {
                name: {
                    first: fields.firstname,
                    last: fields.lastname,
                    full: fields.firstname + ' ' + fields.lastname
                },
                lang: req.app.getUserLocal(req),
                user: {
                    id: workflow.user._id,
                    name: workflow.user.username
                }
            };
            req.app.db.models.Account.create(fieldsToSet, function(err, account){
                if(err){
                    return workflow.emit('exception', err);
                }

                workflow.user.roles.account = account._id;
                workflow.user.save(function(err, user){
                    if(err){
                       return workflow.emit('exception', err);
                    }
                    workflow.emit('sendWelcomeEmail');
                });
            });
        });

        workflow.on('sendWelcomeEmail', function(){
            var bcrypt = require('bcryptjs');
        });

        workflow.emit('validate');

    }
}