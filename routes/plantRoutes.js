var express = require('express');
var router = express.Router();
var plantController = require('../controllers/plantController.js');

/*
 * GET
 */
router.get('/', plantController.list);

/*
 * GET
 */
router.get('/:id', plantController.show);

module.exports = router;
