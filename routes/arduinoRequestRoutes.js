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
