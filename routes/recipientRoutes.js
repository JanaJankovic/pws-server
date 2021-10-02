var express = require('express');
var router = express.Router();
var recipientController = require('../controllers/recipientController.js');
var userUtil = require('../controllers/userUtil.js');

/*
 * POST
 */
router.post('/:user_id', recipientController.create, userUtil.aggregateUser);

/*
 * PUT
 */
router.put('/:user_id/:id', recipientController.update, userUtil.aggregateUser);

/*
 * DELETE
 */
router.delete('/:user_id/:id', recipientController.remove, userUtil.aggregateUser);

module.exports = router;
