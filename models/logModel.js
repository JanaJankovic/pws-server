var mongoose = require('mongoose');
var plantSchema = require('./plantModel.js');
var Schema   = mongoose.Schema;

var logSchema = new Schema({
	'plant' : plantSchema,
	'history' : [String]
});

module.exports = mongoose.model('log', logSchema);
