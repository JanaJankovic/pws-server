var express = require('express');
var router = express.Router();
var plantController = require('../controllers/plantController.js');
var userUtil = require('../controllers/userUtil.js');

/*
 * GET
 */
router.get('/', plantController.list);

/*
 * GET
 */
router.get('/:id', plantController.show);

/*
 * POST
 */

router.post('/plant', plantController.create);

/*
 * PUT
 */
router.put('/:user_id/:recipient_id/:id', plantController.update, userUtil.aggregateUser);

/*
 * DELETE
 */
router.delete('/:id', plantController.remove);

module.exports = router;
