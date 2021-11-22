var express = require('express');
var router = express.Router();
var graphDataController = require('../controllers/graphDataController.js');

/*
 * GET
 */
router.get('/', graphDataController.list);

/*
 * GET
 */
router.get('/:id', graphDataController.show);

/*
 * POST
 */
router.post('/', graphDataController.create);

/*
 * PUT
 */
router.put('/:id', graphDataController.update);

/*
 * DELETE
 */
router.delete('/:id', graphDataController.remove);

module.exports = router;
