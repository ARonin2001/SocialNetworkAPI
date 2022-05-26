const mongoose = require('mongoose');
const bCrypt = require('bcrypt');

const User = mongoose.model('User');
const Role = mongoose.model('Role');
const Language = mongoose.model('Language');

// get one user by id
const getUser = (req, res) => {
    User.findOne({_id: req.params.id})
        .exec()
        .then(user => res.status(200).json(user))
        .catch(err => res.status(500).json(err));
}

//get all users
const getAllUsers = (req, res) => {
    User.find()
        .exec()
        .then(users => res.json(users))
        .catch(err => res.status(500).json(err));
}

// get users by name
const getUsersByName = (req, res) => {
    User.find({"aboutMe.name": req.params.name})
        .exec()
        .then(users => res.json(users))
        .catch(err => res.status(500).json(err));
}

// create new user
const findUserWithSameEmail = async (email) => {
    if(email)
        return await User.findOne({email: email}).exec();
    return null;
}

const createNewUser = async (req, res) => {
    // if body is not empty
    if(Object.keys(req.body).length !== 0) {
        //if email and password is not empty
        if(req.body.email && req.body.password) {
            // проверка на уникальность email
            const sameUser = await findUserWithSameEmail(req.body.email);

            // if user with this email is not already
            if(!sameUser) {
                let body = req.body;

                let aboutMe = {
                    name: body.name,
                    lastName: body.lastName,
                    dateBirth: body.dateBirth,
                    gender: body.gender,
                    // location: {
                    //     country: body.country,
                    //     city: body.city
                    // }
                };

                let newUser = {
                    email: body.email,
                    password: body.password,
                    aboutMe,
                    role: [],
                };

                // hash password
                const passwordHash = bCrypt.hashSync(newUser.password, 5);
                newUser.password = passwordHash;

                // find role user
                const role = await Role.findOne({role: "user"}).exec();

                if(role) {
                    // add role user to newUser
                    newUser.role.push({$ref: "roles", $id: role._id});
                    
                    // crate a new user
                    User.create(newUser)
                        .then(user => {
                            res.status(201).json(user);
                        })
                        .catch(error => {
                            res.status(400).json({message: "The user dont created"});
                        });
                    return;
                } else {
                    res.status(400).json({message: "The role is not found"});
                    return;
                }

            } else {
                res.status(400).json({message: "There is already a user with this email"});
                return;
            }
        } else {
            res.status(400).json({message: "Email or password is empty"});
            return;
        }
    } else {
        res.status(400).json({message: "The users is empty"});
        return;
    }
}

// create new user
const create = (req, res) => {
    createNewUser(req, res);
}

// hash the password
const hashPassword = async (password, saltRounds = 10) => {
    try {
        // Generate a salt
        const salt = await bCrypt.genSalt(saltRounds);

        // Hash password
        return await bCrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }

    // Return null if error
    return null;
};

// add a new role to the user
const addNewRoleToUser = (req, res) => {
    let newRole = req.body.role;
    let userId = req.body.id;

    if(!newRole && !userId) {
        res.status(400).json({message: "data is not correct"});
        return;
    }
    
    // put the role to user who has id = userId
    // if the role already exists, then send an error
}

// update the user status
const updateStatus = (req, res) => {
    let userId = req.params.userId;
    let status = req.body.status;

    if(userId && status) {
        User.updateOne({_id: userId}, {'aboutMe.status': status})
            .exec()
            .then(user => res.status(200).json({message: "The status has be update"}))
            .catch(err => res.status(500).json(err));
            return;
    } else {
        res.status(400).json({message: "The user id or status is empty"});
    }
};

// get status by id
const getStatus = (req, res) => {
    let userId = req.params.userId;

    if(userId) {
        User.findOne({_id: userId}, {_id: 0, "aboutMe.status": 1})
            .exec()
            .then(status => res.status(200).json({status: status.aboutMe.status}))
            .catch(err => res.status(400).json({message: "Status not found"}))
    } else {
        res.status(400).json({message: "The user id is empty"});
    }
}

// add language
const addNewLanguage = async (req, res) => {
    let {userId, lng: language, typeLng, level} = req.params;

    if(userId && language && typeLng) {
        // get language
        let findedLng = await Language.findOne({name: language}).exec();
        
        if(findedLng) {
            // find sames languages in our languages object
            let isSameLng = await findSameLanguage(typeLng, language);

            if(isSameLng) {
                res.status(400).json({message: "There is already a language with this name"});
                return;
            }

            let newLng = {}
            if(level && typeLng === "learning") {
                // create a new object language with level
                newLng = {
                    [arrayLng]: {$ref: "languages", $id: findedLng._id, level: level}
                }
            } else {
                // create a new object language
                let arrayLng = "languages."+typeLng;
                newLng = {
                    [arrayLng]: {$ref: "languages", $id: findedLng._id}
                };
            }

            // create language
            User.findByIdAndUpdate(userId, { $push: newLng}, {safe: true, upsert: true})
                .then(lng => res.status(200).json({lng: lng.languages[typeLng]}))
                .catch(err => res.status(400).json({message: err}));

        } else {
            res.status(400).json({message: "The language is not founded"});
        }
    } else {
        res.status(400).json({message: "userId or language or type of language is empty"});
    }
};

const findSameLanguage = async (typeLng, lng) => {
    // get language id
    let lang = await Language.findOne({name: lng});
    let lngId = lang._id;
    
    let request = {};
    arrayLanguage = "languages."+typeLng+".$id"
    request = {
        [arrayLanguage]: lngId 
    }

    const result = await User.findOne(request)
        .exec();

    if(result)
        return true;
    return false;
}

const addLanguage = (req, res) => {
    addNewLanguage(req, res);
}

// const remove = (req, res) => {
//     Product.deleteOne({id: req.params.id})
//     .exec()
//     .then(() => res.json({success: true}))
//     .catch(err => res.status(500).json(err));
// }

module.exports = {
    getUser,
    getAllUsers,
    getUsersByName,
    create,
    addNewRoleToUser,
    updateStatus,
    getStatus,
    addLanguage
};