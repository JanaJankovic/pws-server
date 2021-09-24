var mongoose = require('mongoose');
var logSchema = require('./logModel');
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
	'log' : [logSchema],
	'notifications' : [notificationSchema]
});

module.exports = mongoose.model('user', userSchema);
