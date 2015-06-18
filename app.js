/**
 * Created by Nils on 6/13/2015.
 *
 * Initialize ExpressJS app & middleware
 *
 */

var express = require('express');
var express_promise = require('express-promise');
var errorhandler = require('errorhandler');
var path = require('path');
var logger = require('morgan');
var body_parser = require('body-parser');
var ValidationError = require('./backbone/backbone-validate').error;

var index = require('./routes/index');
var todo = require('./routes/todo');


var app = express();

// allow promises in responses, let express wait for them to finish
app.use(express_promise());

// init logger middleware
app.use(logger('dev'));

// bind static root
app.use(express.static(path.join(__dirname, 'static')));

// init request body parsing middleware
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

// bind route sets
app.use('/', index);
app.use('/todo', todo);

// default route to generate 404 and forward to error middleware
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers
// write validation error messages
app.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
        err.status = 400;
        // pretty print error array for html dev responses
        if (app.get('env') == "dev")
            err.message = JSON.stringify(err.message, null, "\t");
    }

    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'dev') {
    app.use(errorhandler());
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        status: err.status,
        message: err.message
    });
});

module.exports = app;