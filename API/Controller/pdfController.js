const clsPDFData = require('../Model/clsPdf');
const obj_pdfData = new clsPDFData();

exports.getBillPdf = (req, res) => {
    obj_pdfData.getBillPdf(req.body,res)
        .then((result) => {
            res.statusCode = 200;
            res.send(result);
        }).catch(err => {
            res.statusCode = 500;
            let responseObj = {};
            Object.assign(responseObj, { status: 'fail' }, { result: err });
            res.send(responseObj);
        });
};