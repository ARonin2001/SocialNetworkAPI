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
    friends: [{$ref: String, $id: mongoose.Schema.Types.ObjectId}],
    posts: [{$ref: String, $id: mongoose.Schema.Types.ObjectId}],
    aboutMe: {
        name: { type: String, require:true },
        lastName: { type: String, require:true },
        dateBirth: { type: String, require:true },
        gender: { type: String, require:true },
        location: {
            country: {$ref: String, $id: mongoose.Schema.Types.ObjectId},
            city: {$ref: String, $id: mongoose.Schema.Types.ObjectId},
        },
        status: String,
        description: String,
        hobby: [String],
    }
})

mongoose.model('User', UserSchema);