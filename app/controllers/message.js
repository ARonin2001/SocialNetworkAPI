const mongoose = require('mongoose');
const User = mongoose.model('User');

const { v4: uuidv4} = require('uuid');

const getRoomId = async (userId, companionId) => {
	let roomId = null;

	const allMessages = await User.findById(userId).select({"chat": 1}).exec();

	if(allMessages.chat.length > 0) {
		const msg = allMessages.chat.find(msg => {
			if(msg.companionId == companionId) {
				roomId = msg ? msg.roomId : uuidv4();
				return msg;
			}
		} );
	}

	if(!roomId) {
		roomId = uuidv4();
	}

	if(allMessages.chat.length === 0) {
		roomId = uuidv4();
	}

	return roomId;
}

const chatExists = async (userId, companionId) => {
	const response = await User.find()
		.where({_id: userId})
		.where({"chat.companionId": companionId})
		.select({chat: 1});

	if(Object.keys(response).length === 0 || response.length === 0) 
		return false;
	return true;
}

const createChat = async (userId, companionId, roomId, res) => {

	const isChat = await chatExists(userId, companionId);

	if(!isChat) {
		let newChat = {
			roomId,
			companionId,
			messages: [],
		};

		User.findByIdAndUpdate(userId, {$push: {chat: newChat} }, 
			{safe: true, upsert: true, new: true})
			.select({"friends._id": 0})
			.exec()
			.then(user => {
				let chat = user.chat;
				let pushedChat = chat[chat.length - 1];
				res.status(200).json(pushedChat);	
			})
			.catch(err => res.status(400).json(err.message));
	} else {
		User.findByIdAndUpdate(userId)
			.where({"chat.companionId": companionId})
			.select({"chat.$": 1})
			.exec()
			.then(msg => {
				res.status(200).json(msg.chat[0]);
			})
			.catch(err => res.status(400).json(err.message));
	}
};

const addChat = async (req, res) => {
	const {id: userId, companionId} = req.params;
	let roomId = req.body.roomId;
	roomId = roomId ? roomId : await getRoomId(userId, companionId);

	if(userId && companionId) {
		await createChat(userId, companionId, roomId, res);
		// add chat for companion
		// await createChat(companionId, userId, roomId, res);
	} else {
		res.status(404).json({message: "The userId or companionId is empty"});
		return;
	}
};

const getChat = async (req, res) => {
	const {id: userId, companionId} = req.params;

	if(userId && companionId) {
		User.findById(userId)
			.where({"chat.companionId": companionId})
			.select({"chat.$": 1})
			.exec()
			.then(msg => {
				res.status(200).json(msg.chat[0]);
			})
			.catch(err => res.status(400).json(err.message));
	} else {
		res.status(404).json({message: "The userId or companionId is empty"});
		return;
	}
}

const pushMessage = async (userId, companionId, newMessage, res) => {
	let isChat = await chatExists(userId, companionId);
	if(isChat) {
		User.findByIdAndUpdate(userId, {$push: {"chat.$.messages": newMessage } }, 
			{safe: true, upsert: true, new: true})
			.where({"chat.companionId": companionId})
			.exec()
			.then(user => {
				const chat = user.chat.find(msg => msg.companionId == companionId);
				let sendedMessage = chat.messages[chat.messages.length-1];
				res.status(200).json(sendedMessage); 
			})
			.catch(err => res.status(400).json(err.message));
	} else {
		res.status(404).json({message: "The chat is not exists"});
		return;
	}
};

const creatMessage = async (userId, companionId, message, sender, res) => {
	const newMessage = {
		sender,
		message,
		dateAt: new Date(),
	};
	await pushMessage(userId, companionId, newMessage, res);

	// newMessage.sender = "companion";
	// newMessage.companionId = userId;
	// await pushMessage(companionId, userId, newMessage, res);
}

const addMessage = async (req, res) => {
	const {companionId, message, sender } = req.body;
	const userId = req.params.id;

	if(req.body) {
		if(!message) {
			res.status(404).json({message: "The message is empty"});
			return;
		}
		if(!companionId) {
			res.status(404).json({message: "The companion not found"});
			return;
		}

		// push message in my db
		await creatMessage(userId, companionId, message, sender, res);
	} else {
		res.status(404).json({message: "The body is empty"});
		return;
	}
}

const getAllMessages = async (req, res) => {
	const {companionId, id: userId} =  req.params;

	if(userId && companionId) {
		const allMessages = await User.findById(userId)
			.where({"chat.$.companionId": companionId})
			.select({chat: 1}).exec();
		if(!allMessages) {
			res.status(404).json({messages: "The user not found"});
			return;
		}
		console.log(allMessages);
		const messagesByCompanion = allMessages.chat.filter(msg => msg.companionId == companionId);
		if(messagesByCompanion.length === 0) {
			res.status(404).json({messages: "The messages not found"});
			return; 
		}

		res.status(200).json({messages: messagesByCompanion});
		return;
	} else {
		res.status(404).json({message: "The id of user or id of companion is empty"});
		return;
	}
}

const getUsersByMessages = async (req, res) => {
	let userId = req.params.id;

	if(userId) {
		const user = await User.findById(userId).select({chat: 1}).exec();
		let companionsId = user.chat.map(u => u.companionId);

		User.find({_id: {$in: companionsId} })
		.select({
            "img.ava": 1, 
            "aboutMe.name": 1, "aboutMe.lastName": 1
        })
		.exec()
		.then(users => res.status(200).json(users))
		.catch(err => res.status(400).json(err.message));
	} else {
		res.status(400).json({message: "User id is empty"});
		return;
	}
}


module.exports = {
	addMessage,
	addChat,
	getAllMessages,
	getUsersByMessages,
	getChat,
}