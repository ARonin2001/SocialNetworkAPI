const mongoose = require('mongoose');

// const UserSchema = new mongoose.Schema({
//     id: Number,
//     email: String,
//     password: String,
//     name: String,
//     status: String,
// });
const UserSchema = new mongoose.Schema({
    email: {type: String, require: true, unique: true, sparse: true},
    password: { type: String, require:true },
    img: {
        ava: String,
        backImg: String,
    },
    role: [{$ref:String, $id: mongoose.Schema.Types.ObjectId}],
    languages: {
        native: [ {$ref: String, $id: mongoose.Schema.Types.ObjectId}],
        fluent: [{$ref: String, $id: mongoose.Schema.Types.ObjectId, level: Number}],
        learning: [{$ref: String, $id: mongoose.Schema.Types.ObjectId, level: Number}],
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