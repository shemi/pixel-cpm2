/**
 * Created by pixel on 27/07/2015.
 */

module.exports = function(router, helpers){

    //register
    router.get('/signup', require('../modules/preAuth/register').init);

    //login
    router.get('/login', require('../modules/preAuth/login').init);

    return router;
};
