/**
 * Created by pixel on 23/07/2015.
 */

'use strict';

module.exports = function(app, mongoose){
    var userSchema = new mongoose.Schema({
        username: { type: String, unique: true },
        password: String,
        email: { type: String, unique: true },
        roles: {
            admin: {type: mongoose.Schema.Types.ObjectId, ref: 'Admin'},
            account: {type: mongoose.Schema.Types.ObjectId, ref: 'Account'}
        },
        isActive: String,
        timeCreated: {type: Date, default: Date.now},
        rememberIdentifier: String,
        rememberToken: String,
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        search: [String]
    });

    userSchema.methods.isAdmin = function(){
        if(this.roles.admin){
            return true
        }
        return false
    };

    userSchema.statics.hashPassword = function(password, done){
        var bcrypt = require('bcryptjs');
        bcrypt.genSalt(11, function(err, salt){
            if(err){
                return done(err);
            }
            bcrypt(password, salt, function(err, hash){
                done(err, hash);
            });
        });
    };

    userSchema.statics.validatePassword = function(password, hash, done){
        var bcrypt = require('bcryptjs');
        bcrypt.compare(password, hash, function(err, res){
            return done(err, res);
        });
    };

    userSchema.plugin(require('./plugins/pagedFind'));
    userSchema.index({ username: 1 }, {unique: true});
    userSchema.index({ email: 1 }, {unique: true});
    userSchema.index({ search: 1 });
    userSchema.set('autoIndex', (app.get('env') === 'development'));
    app,db.model('User', userSchema);
};