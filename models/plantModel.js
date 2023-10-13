const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const plantSchema = new Schema({
  common_name: String,
  latin_name: String,
  light: Number,
  humidity: Number,
  temperature: Number,
  moisture: Number,
  frequency: Number,
  moisture_modifier: Number,
  frequency_modifier: Number,
  growth_month: Number,
  hibernation_month: Number,
  customized: Boolean,
});

module.exports = mongoose.model("plant", plantSchema);
