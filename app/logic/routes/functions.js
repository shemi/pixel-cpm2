/**
 * Created by pixel on 23/07/2015.
 */

'use strict';

module.exports = {
    useAngular: function(req, res, next){
        console.log('shemi ', req.user);
        res.sendFile(require('path').join(__dirname, '../../public/app.html'));
    },
    ensureAuthenticated: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        res.set('X-Auth-Required', 'true');
        req.session.returnUrl = req.originalUrl;
        res.redirect('/login');
        return next(false);
    }

}