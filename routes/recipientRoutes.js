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
