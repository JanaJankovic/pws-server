var express = require('express');
var router = express.Router();
var arduinoResponseController = require('../controllers/arduinoResponseController.js');

/*
 * GET
 */
router.get('/:id', arduinoResponseController.show);

/*
 * POST
 */
router.post('/', arduinoResponseController.create);

/*
 * DELETE
 */
router.delete('/:id', arduinoResponseController.remove);

module.exports = router;
