var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');

/*
 * GET - user, just logs or notifications in case request is made from esp8266
 */
router.get('/user/:id', userController.showUser);
router.get('/logs/:id', userController.showLogs);
router.get('/notifications/:id', userController.showNotifications);

/*
 * POST - creating new user, log, notification
 */
router.post('/user', userController.createUser);
router.post('/:id/log', userController.createLog);
router.post('/:id/notification', userController.createNotification);

/*
 * PUT - user for updating only email, password, ip; log for pin; notification for read
 */
router.put('/user/:id', userController.updateUser);
router.put('/:id/log/:log_id', userController.updateLog);
router.put('/:id/notification/:notification_id', userController.updateNotification);

/*
 * DELETE
 */
router.delete('/:id', userController.remove);

module.exports = router;
