const products = require('../app/controllers/products');
const users = require('../app/controllers/user');
const auth = require('../app/controllers/auth');
const authMiddleware = require('../app/middleware/auth');

module.exports = (app) => {

    // products
    // app.get('/products', authMiddleware,
    //     products.getAll,
    // );

    // app.post('/products', authMiddleware,
    //     products.create,
    // );
    // app.put('/products/:id', authMiddleware,
    //     products.update,
    // );
    // app.delete('/products/:id', authMiddleware,
    //     products.remove,
    // );

    // users
    app.get('/user/:id', users.getUser);
    app.get('/users', users.getAllUsers);
    app.get('/users/:name', users.getUsersByName);
    app.post('/users/create', users.create);
    app.post('/user/newrole', users.addNewRoleToUser);

    // auth
    app.post('/auth/login', auth.signIn);
    app.post('/refresh-tokens', auth.refreshTokens);
}