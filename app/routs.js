/**
 * Created by pixel on 23/07/2015.
 */

'use strict';

module.exports = function(app){
    app.use('/', require('./routes/index'));

    //catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
};