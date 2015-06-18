/**
 * Created by Nils on 6/13/2015.
 */

ToDo = require('../models/todo');

// To Do API
api = {
    // List Endpoint
    list: function (req, res, next) {
        // json response containing fetched To Do collection
        res.json((new ToDo.collection()).fetch());
    },

    // Detail Endpoint
    detail: function (req, res, next) {
        // json response containing fetched instance of given id
        res.json((new ToDo({id: req.params.id})).fetch());
    },

    // Delete Endpoint
    delete: function (req, res, next) {
        // delete unfetched model instance with given id
        (new ToDo({id: req.params.id})).destroy().then(function(){
            res.sendStatus(204);
        }, function(err) {
            // customized error message if model instance is missing
            if (err.status == 404)
                err.message = 'Model not found. ID: "' + req.params.id + '"';
            next(err);
        });
    },

    // Update Endpoint
    update: function (req, res, next) {
        // save model with contents of request body
        var params = req.body;
        params.id = req.params.id;
        (new ToDo(params)).save(req.body).then(function(){
            res.sendStatus(204);
        }, function(err) {
            next(err);
        });
    },

    // Create Endpoint
    post: function(req, res, next) {
        res.json((new ToDo(req.body)).save());
    }
};

module.exports = api;