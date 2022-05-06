const bodyParser = require('body-parser');
const cors = require('cors');


const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}

module.exports = (app) => {
    app.use(cors(corsOptions));
    app.use(bodyParser.json());
}