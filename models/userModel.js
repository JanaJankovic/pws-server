var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var notificationSchema = new Schema({
	'title' : String,
	'type' : String,
	'note' : String,
	'dateTime' : String
});

var userSchema = new Schema({
	'email' : String,
	'password' : String,
	'notifications' : [notificationSchema]
});

module.exports = mongoose.model('user', userSchema);
