const express = require('express');
var router = express.Router();
const accountController = require('../Controller/accountController');

router.post('/postAdvance', accountController.postAdvance);
router.post('/postSupply', accountController.postSupply);
router.post('/getAccount', accountController.getAccount);
router.post('/getTotalBalance', accountController.getTotalBalance);


module.exports = router;