const express = require('express');
var router = express.Router();
const truncateController = require('../Controller/truncateController');


router.post('/truncateDailyData', truncateController.truncateDailyData);
router.post('/truncateAccounts', truncateController.truncateAccounts);



module.exports = router;