module.exports = function() {

	var db = require('../libs/db-conecction')()
	var mongoose = require('mongoose')
	var Schema = mongoose.Schema

	var Task =  new Schema({		
		title: String,
		description: String,
		status: Boolean
	})
	return mongoose.model('tasks', Task)
}
