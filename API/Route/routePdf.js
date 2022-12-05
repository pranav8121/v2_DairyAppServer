const express = require('express');
var router = express.Router();
const pdfController = require('../Controller/pdfController');

router.post('/getBillPdf', pdfController.getBillPdf);
router.get('/showPdf', (req, res) => {
    res.render('BillPdf')
});

module.exports = router;