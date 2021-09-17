var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    var dateTime = new Date();
    return res.json(dateTime);
});

module.exports = router;
