var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

/*
 * GET - user, just recipients or notifications in case request is made from esp8266
 */
router.get('/user/:id', userController.showUser);
router.get('/recipients/:id', userController.showRecipients);
router.get('/notifications/:id', userController.showNotifications);

/*
 * POST - creating new user, recipient, notification
 */
router.post('/user', userController.createUser);
router.post('/:id/recipient', userController.createRecipient);
router.post('/:id/notification', userController.createNotification);

/*
 * PUT - user for updating only email, password, ip; recipient for pin; notification for read
 */
router.put('/user/:id', userController.updateUser);
router.put('/:id/recipient/:recipient_id', userController.updateRecipient);
router.put('/:id/notification/:notification_id', userController.updateNotification);

/*
 * DELETE
 */
router.delete('/user/:id', userController.removeUser);
router.delete('/:id/recipient/:recipient_id', userController.removeRecipient);
router.delete('/:id/notification/:notification_id', userController.removeNotification);

module.exports = router;
