var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var logSchema = new Schema({
	'plant_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'plant'
	},
	'user_id' : {
		type: Schema.Types.ObjectId,
		ref: 'user'
   },
	'history' : [String]
});

module.exports = mongoose.model('log', logSchema);
