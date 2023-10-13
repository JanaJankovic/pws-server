const ArduinoresponseModel = require("../models/arduinoResponseModel.js");
const ArduinorequestModel = require("../models/arduinoRequestModel.js");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
/**
 * arduinoResponseController.js
 *
 * @description :: Server-side logic for managing arduinoResponses.
 */
module.exports = {
  /**
   * arduinoResponseController.show()
   */
  show: function (req, res) {
    const id = req.params.id;

    ArduinoresponseModel.findOne(
      { request_id: id },
      function (err, arduinoResponse) {
        if (err) {
          return res.status(500).json({
            message: "Error when getting arduinoResponse.",
            error: err,
          });
        }

        if (!arduinoResponse) {
          return res.status(404).json({
            message: "No such arduinoResponse",
          });
        }

        return res.json(arduinoResponse);
      }
    );
  },

  /**
   * arduinoResponseController.create()
   */
  create: function (req, res) {
    const arduinoResponse = new ArduinoresponseModel({
      request_id: ObjectId(req.body.request_id),
      light: req.body.light,
      humidity: req.body.humidity,
      temperature: req.body.temperature,
      moisture: req.body.moisture,
      message: req.body.message,
    });

    arduinoResponse.save(function (err, arduinoResponse) {
      if (err) {
        return res.status(500).json({
          message: "Error when creating arduinoResponse",
          error: err,
        });
      }

      ArduinorequestModel.findOne(
        { _id: arduinoResponse.request_id },
        function (err, arduinoRequest) {
          if (err) {
            return res.status(500).json({
              message: "Error when getting arduinoRequest.",
              error: err,
            });
          }

          if (!arduinoRequest) {
            return res.status(404).json({
              message: "No such arduinoRequest",
            });
          }

          arduinoRequest.completed = true;

          arduinoRequest.save(function (err) {
            if (err) {
              err.message = "Error when updating the request";
              err.status = 500;
              return next(err);
            }
          });
        }
      );

      return res.status(201).json(arduinoResponse);
    });
  },

  /**
   * arduinoResponseController.remove()
   */
  remove: function (req, res) {
    const id = req.params.id;

    ArduinoresponseModel.findByIdAndRemove(id, function (err, arduinoResponse) {
      ArduinorequestModel.findByIdAndRemove(
        arduinoResponse.request_id,
        function (err, arduinoRequest) {
          if (err) {
            return res.status(500).json({
              message: "Error when deleting the arduinoRequest.",
              error: err,
            });
          }
        }
      );

      if (err) {
        return res.status(500).json({
          message: "Error when deleting the arduinoResponse.",
          error: err,
        });
      }

      return res.status(204).json();
    });
  },
};
