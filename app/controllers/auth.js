const mongoose = require('mongoose');
const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authHelper = require('../helpers/authHelper');
const {secret} = require('../../config/app').jwt;

const User = mongoose.model('User');
const Token = mongoose.model('Token');

const updateTokens = (userId) => {
    const accessToken = authHelper.generateAccessToken(userId);
    const refreshToken = authHelper.generateRefreshToken();

    return authHelper.replaceDbRefreshToken(refreshToken.id, userId)
        .then(() =>({
            accessToken,
            refreshToken: refreshToken.token,
        }));
};

const signIn = (req, res) => {
    const {email, password} = req.body;

    User.findOne({email})
        .exec()
        .then((user) => {
            // if user is not founded
            if(!user) {
                res.status(401).json({messages: "User does not found"})
            }

            // сравнивает захешированный пароль с введённым паролем
            const isValid = bCrypt.compareSync(password, user.password);
            // if user is founded
            if(isValid) {
                // create token
                updateTokens(user._id).then(tokens => res.json({tokens, user}));
            } else {
                res.status(401).json({message: "Invallid credentials!"})
            }
        })
        .catch(err => {
            res.status(500).json({message: err.message})
        });
};

const refreshTokens = (req, res) => {
    const {refreshToken} = req.body;
    let payload;
    try {
        payload = jwt.verify(refreshToken, secret);
        if(payload.type !== 'refresh') {
            res.status(400).json({message: 'Invalid token!'});
            return;
        }
    } catch (e) {
        if(e instanceof jwt.TokenExpiredError) {
            res.status(400).json({message: 'Token expired!'});
            return;
        } else if(e instanceof jwt.JsonWebTokenError) {
            res.status(400).json({message: 'Invalid token!'});
            return;
        }
    }

    Token.findOne({tokenId: payload.id})
        .exec()
        .then(token => {
            if(token === null) {
                throw new Error('Invalid token!');
            }

            return updateTokens(token.userId);
        })
        .then(tokens => {
            res.json(tokens);
        })
        .catch(err => {
            res.status(400).json({message: err.message})
        });
};

module.exports = {
    signIn,
    refreshTokens,
};
