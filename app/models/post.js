const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
	title: String,
	textContent: String,
	img: String,
	countLikes: Number,
	date: Date,
	author: {$ref: String, $id: mongoose.Schema.Types.ObjectId},
});

mongoose.model('Post', PostSchema);