/**
 * Created by pixel on 23/07/2015.
 */

'use strict';

module.exports = {

    init: function(req, res, next){
        if(req.isAuthenticated()){
            res.redirect('/');
        }else{
            res.render('preAuth/login/index', {
                loginErrors: ''
            });
        }
    }

};