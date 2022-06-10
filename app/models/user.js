const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {type: String, require: true, unique: true, sparse: true},
    password: { type: String, require:true },
    img: {
        ava: String,
        backImg: String,
    },
    role: [{$ref:String, $id: mongoose.Schema.Types.ObjectId}],
    languages: {
        native: [{ref: {$ref: String, $id: mongoose.Schema.Types.ObjectId}, name: String} ],
        fluent: [{ref: {$ref: String, $id: mongoose.Schema.Types.ObjectId}, name: String} ],
        learning: [{ref: {$ref: String, $id: mongoose.Schema.Types.ObjectId}, name: String, level: Number}],
    },
    friends: [{id: mongoose.Schema.Types.ObjectId}],
    posts: [{$ref: String, $id: mongoose.Schema.Types.ObjectId}],
    aboutMe: {
        name: { type: String, require:true },
        lastName: { type: String, require:true },
        dateBirth: { type: String, require:true },
        gender: { type: String, require:true },
        location: {
            country: String,
            city: String,
        },
        status: String,
        description: String,
        hobby: String,
    },
    chat: [{
        roomId: String,
        companionId: mongoose.Schema.Types.ObjectId,
        messages: [{
            sender: String,
            message: String,
            dateAt: Date,
        }],
    }],
});

mongoose.model('User', UserSchema);