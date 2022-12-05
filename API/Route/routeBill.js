const express = require('express');
var router = express.Router();
const billController = require('../Controller/billController');

router.post('/postBill', billController.postBill);
router.post('/getExistBillData', billController.getExistBillData);


module.exports = router;