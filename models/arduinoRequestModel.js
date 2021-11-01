var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var arduinoRequestSchema = new Schema({
	'user_id': {
		type: Schema.Types.ObjectId,
		ref: 'users'
	},
	'recipient_id': {
		type: Schema.Types.ObjectId,
		ref: 'recipients'
	},
	'byte_address': String,
	'moisture_pin': Number,
	'relay_pin': Number,
	'activate_pump': Boolean,
	'fetch_data': Boolean,
	'completed': Boolean
});

module.exports = mongoose.model('arduinoRequest', arduinoRequestSchema);
