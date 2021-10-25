var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
var userUtil = require('../controllers/userUtil.js');

function requiresLogin(req, res, next) {
    console.log("auth!");
      if (req.session && req.session.userId) {
        return next();
    } else {
        var err = new Error('You must be logged in for this servise.');
        err.status = 401;
        return next(err);
    }
}

/*
 * GET - user, just recipients or notifications in case request is made from esp8266
 */
router.get('/user/:user_id',  userController.showUser, userUtil.aggregateUser);
router.get('/user_short/:user_id',  userController.showUser, userUtil.aggregateShortRecipients);

/*
 * POST - creating new user, recipient, notification
 */
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/register', userController.createUser);
router.post('/notification/:user_id', userController.createNotification, userUtil.aggregateUser);

/*
 * PUT - user for updating only email, password, ip; recipient for pin; notification for read
 */
router.put('/update_user/:user_id', userController.updateUser, userUtil.aggregateUser);
router.put('/update_notification/:user_id/:notification_id',  userController.updateNotification, userUtil.aggregateUser);

/*
 * DELETE
 */
router.delete('/remove_user/:user_id', userController.removeUser);
router.delete('/remove_notification/:user_id/:notification_id', userController.removeNotification, userUtil.aggregateUser);

module.exports = router;
