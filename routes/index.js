/**
 * Created by Nils on 6/13/2015.
 */
var express = require('express');
var index = require('../views/index');

// Bind root view for API

var router = express.Router();

router.get('/', index.get);

module.exports = router;