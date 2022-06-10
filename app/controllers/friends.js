const mongoose = require('mongoose');
const User = mongoose.model('User');

// add friend
const addFriend = async (req, res) => {
	if(req.params) {
		const userId = req.params.userId;
		const friendId = req.params.friendId;

		if(userId === friendId) {
			res.status(400).json({message: "You can't add yourself"});
			return;
		}

		let user = await User.findOne({_id: friendId}).exec();
		if(!user) {
			res.status(404).json({message: "User with this id was not found"});
			return;
		}

		// If the user already exists
		let alreadyFriend = await User.findOne({$and: [{_id: userId}, {"friends.id": friendId}]}).exec();

		if(alreadyFriend) {
			res.status(400).json({message: "The user already exists"});
			return;
		}

		// add user
		User.findByIdAndUpdate(userId, {$push: {friends: {id: friendId} } }, 
			{safe: true, upsert: true, new: true})
			.select({"friends._id": 0})
			.exec()
			.then(user => {
				let friends = user.friends;
				let pushedFriend = friends[friends.length - 1];
				res.status(200).json(pushedFriend);	
			})
			.catch(err => res.status(400).json(err.message));

	} else {	
		res.status(404).json({message: "Params is empty"});
	}
}

// remove friend
const removeFriend = async (req, res) => {
	let {friendId, userId} = req.params;

	if(friendId && userId) {

		let friend = await User.findOne({"friends.id": friendId}, 
				{"friends.id": 1, _id: 0})
			.exec();

		if(!friend) {
			res.status(400).json({message: "The user not found"});
			return;
		}
		User.findByIdAndUpdate(userId, {$pull: {friends: {id: friendId} }}, 
			{safe: true, upsert: true, new: true}, (err, doc) => {
			if(err)
				res.status(400).json(err.message);
			else
				res.status(200).json(friend.friends);
		});
			
	} else {
		res.status(404).json({message: "The params is empty"});
	}
}

const getMyFriends = async (req, res) => {
	let userId = req.params.userId;

	if(userId) {

		const user = await User.findById(userId).select({"friends": 1}).exec();
		let friendsId = user.friends.map(u => u.id);

		User.find({_id: {$in: friendsId} })
		.select({
            "img.ava": 1, 
            "aboutMe.name": 1, "aboutMe.lastName": 1, "aboutMe.location": 1, "aboutMe.gender": 1, "aboutMe.age": 1,
            languages: 1
        })
		.exec()
		.then(friends => res.status(200).json(friends))
		.catch(err => res.status(400).json(err.message));
	} else {
		res.status(400).json({message: "User id is empty"});
		return;
	}
}

module.exports = {
	addFriend,
	removeFriend,
	getMyFriends,
}