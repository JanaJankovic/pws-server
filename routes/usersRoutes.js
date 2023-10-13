/**
 * @swagger
 * components:
 *   schemas:
 *     Notification:
 *       type: object
 *       required:
 *         - title
 *         - type
 *         - note
 *         - date_time
 *         - read
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the notification
 *         title:
 *           type: string
 *           description: The title of notification
 *         note:
 *           type: string
 *           description: Description of the notification
 *         date_time:
 *           type: string
 *           format: date
 *           description: Creation time of the notification
 *         read:
 *           type: boolean
 *           description: Is notification read or unread
 *       example:
 *         id: 65294a27ec3717b1427b9358
 *         title: Water tank empty!
 *         type: warning
 *         note: Water tank connected to recipient 65294a27ec3734b1427b4321 is empty.
 *         date_time: 2020-03-20T14:28:23.382748
 *         read: false
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email of your user
 *         password:
 *           type: string
 *           description: The encrypted password of the user
 *         notifications:
 *           type: array
 *           description: The notifications regarding watering system assigned to user
 *           items:
 *             $ref: '#/components/schemas/Notification'
 *       example:
 *         id: 65294a27ec3717b1427b9358
 *         email: jana.j00@gmail.com
 *         password: 123
 *         notifications: []
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 * /users/user/{id}:
 *   get:
 *     summary: List recipients or notifications
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: user, just recipients or notifications in case request is made from esp32
 *         content:
 *           application/json:
 *             schema:
 *               type: any
 * /users/register:
 *   post:
 *     summary: Create a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The logged user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 * /users/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The user is logged out.
 *       500:
 *         description: Some server error
 * /users/update_user/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Updated user
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 *       500:
 *        description: Some error happened
 *
 * /users/remove_user/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const userUtil = require("../controllers/userUtil.js");

function requiresLogin(req, res, next) {
  console.log("auth!");
  if (req?.session?.userId) {
    return next();
  } else {
    const err = new Error("You must be logged in for this servise.");
    err.status = 401;
    return next(err);
  }
}

/*
 * GET - user, just recipients or notifications in case request is made from esp32
 */
router.get("/user/:user_id", userController.showUser, userUtil.aggregateUser);

/*
 * POST - creating new user, recipient, notification
 */
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.post("/register", userController.createUser);
router.post(
  "/notification/:user_id",
  userController.createNotification,
  userUtil.aggregateUser
);

/*
 * PUT - user for updating only email, password, ip; recipient for pin; notification for read
 */
router.put(
  "/update_user/:user_id",
  userController.updateUser,
  userUtil.aggregateUser
);
router.put(
  "/update_notification/:user_id/:notification_id",
  userController.updateNotification,
  userUtil.aggregateUser
);

/*
 * DELETE
 */
router.delete("/remove_user/:user_id", userController.removeUser);
router.delete(
  "/remove_notification/:user_id/:notification_id",
  userController.removeNotification,
  userUtil.aggregateUser
);

module.exports = router;
