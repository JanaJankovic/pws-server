/**
 * @swagger
 * components:
 *   schemas:
 *     Recipient:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the recipient
 *         plant_id:
 *           type: string
 *           description: The auto-generated id of the plant
 *         user_id:
 *           type: string
 *           description: The auto-generated id of the user
 *         path:
 *           type: string
 *           description: Path of the image file
 *         byte_address:
 *           type: string
 *           description: Byte address of the waterig station
 *         relay_pin:
 *           type: number
 *           format: int32
 *           description: Relay pin of the water pump
 *         moisture_pin:
 *           type: string
 *           format: int32
 *           description: Pin of the moisture sensor
 *         counter:
 *           type: string
 *           format: int32
 *           description: Counter used for calculatig next watering interval
 *         water_log:
 *           type: array
 *           description: Watering history times
 */

const express = require("express");
const router = express.Router();
const recipientController = require("../controllers/recipientController.js");
const userUtil = require("../controllers/userUtil.js");

/*
 * POST
 */
router.post("/:user_id", recipientController.create, userUtil.aggregateUser);
router.post("/water/:id", recipientController.addDateLog);

/*
 * GET
 */
router.get("/short/:user_id/:byte_address", recipientController.list);

/*
 * PUT
 */
router.put("/:user_id/:id", recipientController.update, userUtil.aggregateUser);

/*
 * DELETE
 */
router.delete(
  "/:user_id/:id",
  recipientController.remove,
  userUtil.aggregateUser
);

module.exports = router;
