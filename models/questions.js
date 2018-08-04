//model
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/node-api');

var QuestionSchema = mongoose.Schema({
	text: String,
	options: [String],
	number: Number,
	answer: String
});

var Question = module.exports = mongoose.model('Question', QuestionSchema);

module.exports.getQuestionByNumber = function(number, callback){
	var query = {number: number};
Question.findOne(query, callback);
}
