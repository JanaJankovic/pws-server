var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var notificationSchema = new Schema({
	'title' : String,
	'type' : String,
	'note' : String,
	'date_time' : String, 
	'read' : Boolean
});

var logSchema = new Schema({
	'plant_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'plant'
	},
	'pin' : Number,
	'history' : [String], 
	'mac_address' : String
	
});

var userSchema = new Schema({
	'email' : String,
	'password' : String,
	'ip' : String,
	'notifications' : [notificationSchema],
	'logs' : [logSchema]
});

module.exports = mongoose.model('user', userSchema);

