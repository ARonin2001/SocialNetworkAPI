const mongoose = require('mongoose');

const User = mongoose.model('User');
const Role = mongoose.model('Role');

// get one user by id
const getUser = (req, res) => {
    User.findOne({id: req.params.id})
        .exec()
        .then(user => res.json(user))
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
const create = (req, res) => {
    let newUser = req.body;
    // if req.body is empty
    if(!newUser) {
        res.status(400).json({err: "object is Empty"});
        return;
    }

    // if email and password is not empty
    if(newUser.email && newUser.password) {
        // find role where role = user
        Role.findOne({role: "user"})
            .exec()
            .then(role => {
                // push a role 'user'
                newUser.role = [{$ref: "roles", $id: role._id}];
                
                // create a new user
                User.create(newUser)
                    .then(user => res.status(201).json(user))
                    .catch(err => res.status(400).json({message: "user is don't created"}));
            })
            .catch(err => res.status(500).json({message: "role is not found"}));
    }
    else {
        res.status(400).json({err: "email or password is empty"});
        return;
    } 
}

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

// const update = (req, res) => {
//     Product.findOneAndUpdate({id: req.params.id}, req.body)
//     .exec()
//     .then(product => res.json(product))
//     .catch(err => res.status(500).json(err));
// }

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
};