const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const graphDataSchema = new Schema({
  recipient_id: {
    type: Schema.Types.ObjectId,
    ref: "recipients",
  },
  light: Number,
  temp: Number,
  humidity: Number,
  moisture: Number,
  date_posted: String,
});

module.exports = mongoose.model("graph_data", graphDataSchema);
