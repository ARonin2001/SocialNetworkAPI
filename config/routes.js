const users = require('../app/controllers/user');
const auth = require('../app/controllers/auth');
const userAva = require('../app/controllers/userAva');
const language = require('../app/controllers/languages');

const authMiddleware = require('../app/middleware/auth');
const {upload} = require('../app/middleware/upload');

module.exports = (app) => {
    // users
    app.get('/user/:userId', users.getUser);
    app.get('/users', users.getAllUsers);
    app.get('/users/:name', users.getUsersByName);
    app.post('/users/create', users.create);
    app.post('/user/newrole', users.addNewRoleToUser);
    app.get('/user/status/:userId', users.getStatus);
    app.put('/user/update/status/:userId', users.updateStatus);

    // images ava
    app.put('/user/upload/ava/:userId', upload.single('avatar'), userAva.uploadImage);
    app.get('/user/ava/:userId', userAva.getAvaByUserId);

    // languages
    app.get('/languages', language.getAllLanguagesInOriginalName);
    // app.post('/user/languages/add/:typeLng/:lng/:userId', users.addLanguage);
    app.post('/user/languages/add/:typeLng/:lng/:level/:userId', users.addLanguage);
    app.put('/user/languages/update/:lngId/:level/:userId', users.updateLevelLanguage);
    app.delete('/user/languages/remove/:typeLng/:lngId/:userId', users.removeLanguage);

    // auth
    app.post('/auth/login', auth.signIn);
    app.post('/refresh-tokens', auth.refreshTokens);
}