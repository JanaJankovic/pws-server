var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var commandSchema = new Schema({
	'water' : Boolean,
	'user_id' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'pin' : Number
});

module.exports = mongoose.model('command', commandSchema);
