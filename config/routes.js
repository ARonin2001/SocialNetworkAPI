const users = require('../app/controllers/user');
const auth = require('../app/controllers/auth');
const userAva = require('../app/controllers/userAva');
const language = require('../app/controllers/languages');
const country = require('../app/controllers/country');
const friends = require('../app/controllers/friends');
const messages = require('../app/controllers/message');

const authMiddleware = require('../app/middleware/auth');
const {upload} = require('../app/middleware/upload');

const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (app, io) => {
    

    // users
    app.get('/user/:userId', users.getUser);

    app.get('/users/:count/:page', users.getSomeUsers);

    app.get('/users/:name', users.getUsersByNameOrLastName);
    app.post('/users/create', users.create);
    app.post('/user/newrole', users.addNewRoleToUser);
    app.get('/user/status/:userId', users.getStatus);
    app.put('/user/update/status/:userId', users.updateStatus);
    app.put('/user/update/aboutMe/:userId', users.updateAboutMe);

    // images ava
    app.put('/user/upload/ava/:userId', upload.single('avatar'), userAva.uploadImage);
    app.get('/user/ava/:userId', userAva.getAvaByUserId);

    // languages
    app.get('/languages', language.getAllLanguagesInOriginalName);
    // app.post('/user/languages/add/:typeLng/:lng/:userId', users.addLanguage);
    app.post('/user/languages/add/:typeLng/:lng/:level/:userId', users.addLanguage);
    app.put('/user/languages/update/:lngId/:level/:userId', users.updateLevelLanguage);
    app.delete('/user/languages/remove/:typeLng/:lngId/:userId', users.removeLanguage);

    // country
    app.get('/countries', country.getCountries);

    // friends
    app.put('/friends/add/:friendId/:userId', friends.addFriend);
    app.delete('/friends/remove/:friendId/:userId', friends.removeFriend);
    app.get('/friends/:userId', friends.getMyFriends);

    // messages
    app.put('/messages/:id', messages.addMessage);
    app.get('/messages/:companionId/:id', messages.getAllMessages);
    app.get('/messages/get/companions/:id', messages.getUsersByMessages);
    app.put('/messages/add/chat/:companionId/:id', messages.addChat);

    // auth
    app.post('/auth/login', auth.signIn);
    app.post('/refresh-tokens', auth.refreshTokens);
}