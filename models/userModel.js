var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var notificationSchema = new Schema({
	'title' : String,
	'type' : String,
	'note' : String,
	'dateTime' : String
});

var logSchema = new Schema({
	'plant_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'plant'
	},
	'history' : [String]
});

var userSchema = new Schema({
	'email' : String,
	'password' : String,
	'notifications' : [notificationSchema],
	'logs' : [logSchema]
});

module.exports = mongoose.model('user', userSchema);
