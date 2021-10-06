var express = require('express');
var router = express.Router();
var arduinoRequestController = require('../controllers/arduinoRequestController.js');

/*
 * GET
 */
router.get('/:user_id/:ip', arduinoRequestController.show);

/*
 * POST
 */
router.post('/', arduinoRequestController.create);

/*
 * DELETE
 */
router.delete('/:id', arduinoRequestController.remove);

module.exports = router;
