var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

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
router.get('/user/:id', requiresLogin, userController.showUser);
router.get('/recipients/:id', requiresLogin, userController.showRecipients);
router.get('/notifications/:id', requiresLogin, userController.showNotifications);

/*
 * POST - creating new user, recipient, notification
 */
router.post('/login', userController.loginUser);
router.post('/logout', userController.logoutUser);
router.post('/register', userController.createUser);
router.post('/:id/recipient', requiresLogin, userController.createRecipient);
router.post('/:id/notification', requiresLogin, userController.createNotification);

/*
 * PUT - user for updating only email, password, ip; recipient for pin; notification for read
 */
router.put('/update_user/:id', requiresLogin, userController.updateUser);
router.put('/:id/update_recipient/:recipient_id', requiresLogin, userController.updateRecipient);
router.put('/:id/update_notification/:notification_id', requiresLogin, userController.updateNotification);

/*
 * DELETE
 */
router.delete('/remove_user/:id', requiresLogin, userController.removeUser);
router.delete('/:id/remove_recipient/:recipient_id', requiresLogin, userController.removeRecipient);
router.delete('/:id/remove_notification/:notification_id', requiresLogin, userController.removeNotification);

module.exports = router;
