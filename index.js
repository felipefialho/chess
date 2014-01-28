//! chess.js
//! version : 0.0.1
//! authors : Thiago Genuino, Luiz Felipe
//! contributor : Trendi Relevance Builders http://trendi.com.br
//! license : MIT
(function(undefined) {

    var express = require('express')
        , app = module.exports = express()
        , config = require('./config.json')
        , server = require('http').createServer(app)
        , io = require('socket.io').listen(server)
        , mongoose = require('mongoose')
        , facebook = require('facebook-node-sdk');

    // APP config
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/view');
    app.use(express.static(__dirname + '/public/'+config.enviroment));

    app.configure(function() {
        app.use(express.bodyParser());
        app.use(express.cookieParser());
        app.use(express.session({secret: 'CheSS.js'}));
        app.use(facebook.middleware(config.facebook));
    });

    // Path to APP
    app.path = __dirname;

    // Facebook SDK Instance
    app.facebook = new facebook(config.facebook);
    app.fbClass = facebook;

    // Socket.io
    app.io = io;

    // MongoDB Mongoose
    app.conn = mongoose.connect(config.database.host);

    server.listen(config.port);

    app.validate = require('./lib/validate.js');

    require('./lib/app.js');
    require('./lib/events.js');
    require('./lib/models.js');
    require('./lib/routes.js');
    require('./lib/sockets.js');


}).call(this);