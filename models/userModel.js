var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var notificationSchema = new Schema({
	'title' : String,
	'type' : String,
	'note' : String,
	'date_time' : String, 
	'read' : Boolean
});

var recipientSchema = new Schema({
	'plant_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'plant'
	},
	'mac_address' : String,
	'pin' : Number,
	'watering_log' : [String], 
	
});

var userSchema = new Schema({
	'email' : String,
	'password' : String,
	'ip' : String,
	'notifications' : [notificationSchema],
	'recipients' : [recipientSchema]
});

module.exports = mongoose.model('user', userSchema);

