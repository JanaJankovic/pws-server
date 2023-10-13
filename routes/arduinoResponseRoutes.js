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
