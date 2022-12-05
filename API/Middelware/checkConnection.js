const mongoose = require('mongoose')

function checkConnection(err,req, res,next){
    //1=connected 0=disconnected
    const status = mongoose.connection.readyState;
    if (status != 1) {
        return next(res.status(401).send({ error: 'DataBase Connection Err!' }))
    }
    return next();
};
module.exports.checkConnection = checkConnection;