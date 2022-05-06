const mongoose = require("mongoose");

const RoleSchema = mongoose.Schema({
    role:String
});

mongoose.model('Role', RoleSchema);