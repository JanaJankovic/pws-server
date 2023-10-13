/**
 * @swagger
 * components:
 *   schemas:
 *     ArduinoRequest:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the request id
 *         recipient_id:
 *           type: string
 *           description: The auto-generated id of the recipient id
 *         byte_address:
 *           type: string
 *           description: Byte address of the watering station
 *         moisture_pin:
 *           type: number
 *           description: Pin of the moisture sensor
 *         relay_pin:
 *           type: number
 *           description: Relay pin of the pump
 *         activate_pump:
 *           type: boolean
 *           description: Whether to activate pump and start watering
 *         fetch_data:
 *           type: boolean
 *           description: Whether to just fetch data without any other action
 *         completed:
 *           type: boolean
 *           description: Whether the action is complete
 */

const express = require("express");
const router = express.Router();
const arduinoRequestController = require("../controllers/arduinoRequestController.js");

/*
 * GET
 */
router.get("/:user_id/:byte_address", arduinoRequestController.show);

/*
 * POST
 */
router.post("/", arduinoRequestController.create);

/*
 * DELETE
 */
router.delete("/:id", arduinoRequestController.remove);

module.exports = router;
