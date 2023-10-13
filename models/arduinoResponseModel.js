const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const arduinoResponseSchema = new Schema({
  request_id: {
    type: Schema.Types.ObjectId,
    ref: "arduinoRequests",
    unique: true,
    required: true,
    dropDups: true,
  },
  light: Number,
  humidity: Number,
  temperature: Number,
  moisture: Number,
  message: String,
});

module.exports = mongoose.model("arduinoResponse", arduinoResponseSchema);
