var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var recipientSchema = new Schema({
	'plant_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'plant'
	},
	'user_id' : {
		type: Schema.Types.ObjectId,
		ref: 'user'
   },
   	'path': String,
	'byte_address' : String,
	'relay_pin' : Number,
	'moisture_pin' : Number,
	'counter': Number,
	'water_log' : Array
});

module.exports = mongoose.model('recipient', recipientSchema);
