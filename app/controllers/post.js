const mongoose = require('mongoose');
const Post = mongoose.model('Post');

const addPost = (req, res) => {
	const userId = req.params.id;
	const post = {...req.body};

	if(userId) {
		console.log(req);
		if(post.title && post.textContent) {
			const postImg = req.file.filename ? req.file.filename : null;
			let pathImg = null;

			if(postImg) {
				pathImg = "/posts/" + req.file.filename;
			}

			const newPost = {
				title: post.title,
				textContent: post.textContent,
				img: pathImg,
				countLikes: 0,
				date: new Date(),
				author: {$ref: 'users', $id: userId}
			};

			Post.create(newPost)
				.then(post => res.status(200).json(post))
				.catch(err => res.status(400).json(err));
		} else {
			res.status(404).json({message: "Post title or text content is empty"});
			return
		}
	} else {
		res.status(404).json({message: "userId is empty"});
	}

}

module.exports = {
	addPost,
}