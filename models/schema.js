const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dataSchema = new Schema({
	url:{
		type: String,
		required: [true, 'URL is required to monitor']
	},
	data:{
		type: Schema.Types.Mixed
	},
	method:{
		type: String
	},
	timeid: {
		type: Number
	},
	resTime: [{
		type: Number
	}]
});

module.exports = dataSchema;