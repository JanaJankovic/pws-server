/**
 * @swagger
 * components:
 *   schemas:
 *     ArduinoResponse:
 *       type: object
 *       properties:
 *         request_id:
 *           type: string
 *           description: The auto-generated id of the request id
 *         light:
 *           type: number
 *           description: Light value at measured time
 *         temp:
 *           type: number
 *           description: Temp value at measured time
 *         humidity:
 *           type: number
 *           description: Humidity value at measured time
 *         moisture:
 *           type: number
 *           description: Moisture value at measured time
 *         message:
 *           type: string
 *           description: Description of a potential error
 */

const express = require("express");
const router = express.Router();
const arduinoResponseController = require("../controllers/arduinoResponseController.js");

/*
 * GET
 */
router.get("/:id", arduinoResponseController.show);

/*
 * POST
 */
router.post("/", arduinoResponseController.create);

/*
 * DELETE
 */
router.delete("/:id", arduinoResponseController.remove);

module.exports = router;
