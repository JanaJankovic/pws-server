/**
 * @swagger
 * components:
 *   schemas:
 *     GraphData:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the graph
 *         recipient_id:
 *           type: string
 *           description: The auto-generated id of the recipient
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
 *         date_posted:
 *           type: string
 *           format: date
 *           description: Date time of measurement
 */

const express = require("express");
const router = express.Router();
const graphDataController = require("../controllers/graphDataController.js");

/*
 * GET
 */
router.get("/", graphDataController.list);

/*
 * GET
 */
router.get("/:id", graphDataController.show);

/*
 * POST
 */
router.post("/", graphDataController.create);

/*
 * PUT
 */
router.put("/:id", graphDataController.update);

/*
 * DELETE
 */
router.delete("/:id", graphDataController.remove);

module.exports = router;
