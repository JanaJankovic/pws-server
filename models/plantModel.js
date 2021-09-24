var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var plantSchema = new Schema({
	'common_name' : String,
	'latin_name' : String,
	'light' : Number,
	'humidity' : Number,
	'temperature' : Number,
	'moisture' : Number,
	'frequency' : Number,
	'modifier' : Number
});

module.exports = mongoose.model('plant', plantSchema);
