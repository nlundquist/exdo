/**
 * Created by Nils on 6/13/2015.
 */
var express = require('express');
var todo = require('../views/todo');

// Bind routes & verbs to To Do API impls

var router = express.Router();

router.get('/', todo.list);
router.post('/', todo.post);
router.get('/:id', todo.detail);
router.put('/:id', todo.update);
router.delete('/:id', todo.delete);

module.exports = router;