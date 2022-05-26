const bodyParser = require('body-parser');
const cors = require('cors'); 


const corsOptions ={
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

module.exports = (app, express) => {
    app.use(express.static(__dirname + "/uploads/profile/ava"));
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
    
    // app.use('/uploads', express.static('uploads'))
}