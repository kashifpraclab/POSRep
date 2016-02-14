'use strict';
/* eslint no-shadow:0 *//* app is already declared in the upper scope */

const http         = require('http');              // http
const koaJs        = require('koa');               // Koa framework
const body         = require('koa-body');          // body parser
const compose      = require('koa-compose');       // middleware composer
const compress     = require('koa-compress');      // HTTP compression
const responseTime = require('koa-response-time'); // X-Response-Time middleware
const session      = require('koa-session');       // session for passport login, flash messages

const posApp = module.exports = koaJs();


// return response time in X-Response-Time header
posApp.use(responseTime());


// HTTP compression
posApp.use(compress({}));


// parse request body into ctx.request.body
posApp.use(body());


// session for passport login, flash messages
posApp.keys = ['koa-pos-app'];
posApp.use(session(posApp));


//// MySQL connection pool TODO: how to catch connection exception eg invalid password?
//const config = require('./config/db-' + posApp.env + '.json');
//GLOBAL.connectionPool = mysql.createPool(config.db); // put in GLOBAL to pass to sub-apps


// select sub-app (admin/api) according to host subdomain (could also be by analysing request.url);

posApp.use(function* () { yield compose(require('./server/membership/index.js').middleware);});

//posApp.use(function* subApp(next) {
//    // use subdomain to determine which app to serve: www. as default, or admin. or api
//    const subapp = this.hostname.split('.')[0]; // subdomain = part before first '.' of hostname
    
//    switch (subapp) {
//        case 'admin':
//            yield compose(require('./apps/admin/app-admin.js').middleware);
//            break;
//        case 'api':
//            yield compose(require('./apps/api/app-api.js').middleware);
//            break;
//        case 'www':
//            yield compose(require('./server/membership/index.js').middleware);
//            break;
//        default:// no subdomain? canonicalise hostname to www.hostname
//            yield compose(require('./server/membership/index.js').middleware); //this.redirect(this.protocol + '://' + 'www.' + this.host + this.path + this.search);
//            break;
//    }
//});


if (!module.parent) {
    /* eslint no-console: 0 */
    posApp.listen(process.env.PORT || 3000);
    //const db = require('./config/db-' + posApp.env + '.json').db.database;
    console.log(process.version + ' listening on port ' + (process.env.PORT || 3000) );
}
