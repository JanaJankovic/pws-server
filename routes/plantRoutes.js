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

/*
 * POST
 */
router.post('/', plantController.create);

/*
 * PUT
 */
router.put('/:id', plantController.update);

/*
 * DELETE
 */
router.delete('/:id', plantController.remove);

module.exports = router;
