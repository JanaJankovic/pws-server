/**
 * @swagger
 * components:
 *   schemas:
 *     Plant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the plant
 *         latin_name:
 *           type: string
 *           description: Latin name of the plant
 *         light:
 *           type: number
 *           description: Preferred exposure to light
 *         humidity:
 *           type: number
 *           description: Preferred humidity level
 *         temperature:
 *           type: number
 *           description: Preferred temperature level
 *         moisture:
 *           type: number
 *           description: Preferred moisture level
 *         frequency:
 *           type: number
 *           description: Watering frequency
 *         moisture_modifier:
 *           type: number
 *           description: Modifier deducted from preferred moisture in hiberation season
 *         frequency_modifier:
 *           type: number
 *           description: Modifier deducted from preferred watering frequency in hiberation season
 *         growth_month:
 *           type: number
 *           description: Starting month of growth season
 *         hibernation_month:
 *           type: number
 *           description: Starting month of hibernation season
 *         customized:
 *           type: boolean
 *           description: Whether plant requires customization for growing season and hibernating season
 */

const express = require("express");
const router = express.Router();
const plantController = require("../controllers/plantController.js");
const userUtil = require("../controllers/userUtil.js");

/*
 * GET
 */
router.get("/", plantController.list);

/*
 * GET
 */
router.get("/:id", plantController.show);

/*
 * POST
 */

router.post("/plant", plantController.create);

/*
 * PUT
 */
router.put(
  "/:user_id/:recipient_id/:id",
  plantController.update,
  userUtil.aggregateUser
);

/*
 * DELETE
 */
router.delete("/:id", plantController.remove);

module.exports = router;
