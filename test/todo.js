var chai = require('chai');
var chai_http = require('chai-http');
var app = require('../app');
var ToDo = require('../models/todo');
var request = require('request');


// add chai http testing plugin
chai.use(chai_http);
var expect = chai.expect;

// set promise library required for chai_http
// Node 0.11 will have native promises and not require 'q'
if (!global.Promise) {
    var q = require('q');
    chai.request.addPromises(q.Promise);
}


var test_data = [
    {
        title: 'one',
        complete: false
    },
    {
        title: 'two',
        complete: false
    },
    {
        title: 'three',
        complete: true
    }
];

// map title -> id, look up generated ids during tests
var test_todo_ids = {};

// used for test clean up, deletes a given id or all docs if no given
var delete_document = function(id) {
    return request.del(
        process.env.EXDO_SIMPLESTORE_URL+'/'+(id || ''),
        {auth: {
            user: process.env.EXDO_SIMPLESTORE_USER,
            pass: process.env.EXDO_SIMPLESTORE_PASSWORD
        }}
    );
};


// To Do API test suite

describe('To Do', function() {

    // load test data
    before(function(done) {
        var count = test_data.length;

        test_data.forEach(function(data) {
            request.post(
                process.env.EXDO_SIMPLESTORE_URL,
                {
                    json: true,
                    body: data,
                    auth: {
                        user: process.env.EXDO_SIMPLESTORE_USER,
                        pass: process.env.EXDO_SIMPLESTORE_PASSWORD
                    }
                },
                function(err, http, body) {
                    test_todo_ids[data.title] = body.id;
                    if (--count == 0) done();
                }
            );
    });
    });

    // ensure test data deleted
    after(function(done){
        delete_document().on('response', function(){done()}).on('error', function(){done()});
    });

    describe('list', function () {
        it('returns a list of valid todos', function () {
            return chai.request(app)
                .get('/todo/')
                .send()
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(res.body.collection).to.have.length(3);

                    res.body.collection.forEach(function(todo_json) {
                        expect(function(){new ToDo(todo_json)}).to.not.throw(TypeError);
                    })
                });
        });
    });

    describe('detail', function () {
        it('returns valid todo associated with id', function () {
            return chai.request(app)
                .get('/todo/'+test_todo_ids['one'])
                .send()
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(function(){new ToDo(res.body)}).to.not.throw(TypeError);
                    expect(res.body.title).to.equal('one');
                    expect(res.body.complete).to.equal(false);
                });
        });
        it('returns 404 for an invalid id, with descriptive error message', function () {
            return chai.request(app)
                .get('/todo/not-an-id')
                .send()
                .then(function(res) {
                    expect(res).to.have.status(404);
                    expect(res.body).to.deep.equal({
                        "status": 404,
                        "message": "Model not found. ID: \"not-an-id\""
                    });
                });
        });
    });

    var created_id;
    describe('create', function () {
        it('returns a valid todo when a valid todo is passed as a JSON request body', function () {
            return chai.request(app)
                .post('/todo/')
                .set('Content-Type', 'application/json')
                .send({
                    title: 'creation test',
                    complete: false
                })
                .then(function(res) {
                    expect(res).to.have.status(200);
                    expect(function(){new ToDo(res.body)}).to.not.throw(TypeError);
                    expect(res.body.title).to.equal('creation test');
                    expect(res.body.complete).to.equal(false);
                    created_id = res.body.id;
                });
        });
        it('returns a 400 & descriptive error message when passed an invalid To Do request body', function () {
            return chai.request(app)
                .post('/todo')
                .set('Content-Type', 'application/json')
                .send({
                    title: 'creation test'
                })
                .then(function(res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.deep.equal({
                        "message": {"complete": ["Complete can't be blank"]},
                        "status": 400
                    });
                });
        });
        after(function(done) {
            // cleanup succesful model creation
            delete_document(created_id).on('response', function(){done()}).on('error', function(){done()});
        });
    });

    describe('update', function () {
        it('returns 204 on success', function () {
            return chai.request(app)
                .put('/todo/'+test_todo_ids['one'])
                .set('Content-Type', 'application/json')
                .send({
                    title: 'one',
                    complete: true
                })
                .then(function(res) {
                    expect(res).to.have.status(204);
                });
        });
        it('returns 400 & descriptive error message body when passed an invalid JSON request body', function () {
            return chai.request(app)
                .post('/todo')
                .set('Content-Type', 'application/json')
                .send({
                    title: 'one'
                })
                .then(function(res) {
                    expect(res).to.have.status(400);
                    expect(res.body).to.deep.equal({
                        "message": {"complete": ["Complete can't be blank"]},
                        "status": 400
                    });
                });
        });
    });

    describe('delete', function () {
        it('returns 204 and todo get returns 404', function () {
            var confirmation_req = chai.request(app)
                .get('/todo/'+test_todo_ids['one']);

            chai.request(app)
                .del('/todo/'+test_todo_ids['one'])
                .send()
                .then(function(res) {
                    expect(res).to.have.status(204);

                    // test model is deleted
                    confirmation_req.send().then(function(res) {
                        expect(res).to.have.status(404);
                    }, function(err) {throw err});
                }, function(err) {throw err});

            return confirmation_req;
        });
        it('returns a 404 & error message body for an invalid id', function () {
            return chai.request(app)
                .del('/todo/not-an-id')
                .send()
                .then(function(res) {
                    expect(res).to.have.status(404);
                    expect(res.body).deep.equal({
                        "status": 404,
                        "message": "Model not found. ID: \"not-an-id\""
                    });
                });
        });
    });
});
