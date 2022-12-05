const clsAccount = require('../Model/clsAccount');
const obj_Account = new clsAccount();

exports.getAccount = (req, res) => {
    obj_Account.getAccount(req.body)
        .then((result) => {
            res.statusCode = 200;
            res.send(result);
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            let responseObj = {};
            Object.assign(responseObj, { status: 'fail' }, { result: err });
            res.send(responseObj);
        });
};

exports.postAdvance = (req, res) => {
    obj_Account.postAdvance(req.body)
        .then((result) => {
            res.statusCode = 200;
            res.send(result);
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            let responseObj = {};
            Object.assign(responseObj, { status: 'fail' }, { result: err });
            res.send(responseObj);
        });
};


exports.postSupply = (req, res) => {
    obj_Account.postSupply(req.body)
        .then((result) => {
            res.statusCode = 200;
            res.send(result);
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            let responseObj = {};
            Object.assign(responseObj, { status: 'fail' }, { result: err });
            res.send(responseObj);
        });
};

exports.getTotalBalance = (req, res) => {
    obj_Account.getTotalBalance(req.body)
        .then((result) => {
            res.statusCode = 200;
            res.send(result);
        }).catch(err => {
            console.log(err);
            res.statusCode = 500;
            let responseObj = {};
            Object.assign(responseObj, { status: 'fail' }, { result: err });
            res.send(responseObj);
        });
};