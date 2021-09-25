var express = require('express');
var router = express.Router();
var commandController = require('../controllers/commandController.js');

/*
 * GET
 */
router.get('/', commandController.list);
router.get('/:id', commandController.show);

/*
 * POST 
 */
router.post('/', commandController.create);


/*
 * PUT
 */
router.put('/:id', commandController.update);


/*
 * DELETE
 */
router.delete('/:id', commandController.remove);

module.exports = router;
