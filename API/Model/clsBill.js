const date = require('date-and-time');
const path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf');
var options = { format: 'Letter' };
const fs = require('fs');

const collection = require("../../Schemas/doc_bills");
const Dailycollection = require("../../Schemas/doc_dailyData");
const clsDailyData = require('./clsDailyData');
const obj_dailyData = new clsDailyData();
const clsAccount = require('./clsAccount');
const obj_Account = new clsAccount();
const clsPDFData = require('../Model/clsPdf');
const obj_pdfData = new clsPDFData();
class clsBillData {
    async postBill(req) {
        try {
            let obj_response = {};
            let now = new Date();
            let today = date.format(now, 'YYYY-MM-DD');
            let dates = obj_dailyData.getLastBill();
            let data = {
                Name: req.Name,
                No: req.No,
                UId: req.UId,
                totalmilk: req.totalMilk,
                totalRate: req.totalRate,
                morTotalmilk: req.mor_totalMilk,
                mortotalRate: req.mor_totalRate,
                eveTotalmilk: req.eve_totalMilk,
                evetotalRate: req.eve_totalRate,
                advance: req.advance,
                bank: req.bank,
                supply: req.supply,
                balance: req.balance,
                cutting: req.totalCutting,
                amountTogiven: req.amountTogiven,
                inv_no: `${req.No}|${dates.from}|${dates.to}`,
                from: new Date(dates.from),
                to: new Date(dates.to),
                generatedOn: new Date(today),
            }
            let reqAdvCutting = {
                cutAmount: req.advance,
                type: "advance",
                No: req.No,
                Name: req.Name,
                UId: req.UId
            }

            let reqSupplyCutting = {
                cutAmount: req.supply,
                type: "supply",
                No: req.No,
                Name: req.Name,
                UId: req.UId
            }

            let cond = { inv_no: `${req.No}|${dates.from}|${dates.to}`, UId: req.UId }
            let ifExist = await collection.findOne(cond);
            if (ifExist) {
                Object.assign(obj_response, { status: 'success' }, { result: "Data Already Exist" });
                return obj_response;
            } else {
                let createdData = await collection.create(data);
                if (Object.keys(createdData).length !== 0) {
                    let res1 = await obj_Account.postAdvance(reqAdvCutting);
                    let res2 = await obj_Account.postSupply(reqSupplyCutting);
                    console.log(res1.result == "Data Added Successfully" && res2.result == "Data Added Successfully");
                    if (res1.result == "Data Added Successfully" && res2.result == "Data Added Successfully") {
                        Object.assign(obj_response, { status: 'success' }, { result: "Data Added Successfully" });
                        return obj_response;
                    } else {
                        await collection.delete({ inv_no: `${req.No}|${dates.from}|${dates.to}`, UId: req.UId });
                        Object.assign(obj_response, { status: 'success' }, { result: "Error Saving" });
                        return obj_response;
                    }
                } else {
                    Object.assign(obj_response, { status: 'success' }, { result: "NA" });
                    return obj_response;
                }
            }
        } catch (err) {
            console.log(err);
            this.notify.hideWarningToast();
            this.notify.showErrorWithTimeout("Error Saving Data", "");
            return err;
        }
    }

    async getExistBillData(req, res) {
        try {
            let obj_response = {};
            let now = new Date();
            let today = date.format(now, 'YYYY-MM-DD');
            let dates = obj_dailyData.getLastBill(req, res);
            let data = {
                UId: req.UId,
                No: req.No,
                from: new Date(dates.from),
                to: new Date(dates.to)
            }
            let result = await collection.findOne(data);
            if (result) {
                let now = new Date();
                var fileName = 'BillKapila.pdf';
                let data = {
                    UId: result.UId,
                    No: result.No,
                    date: { $gte: result.from, $lte: result.to }
                };
                const doc = await Dailycollection.find(data);
                Object.assign(result, { data: doc });
                // Object.assign(result, { moment: moment });
                // {
                //     _id: new ObjectId("63891ef50bed9ff7a57ce73c"),
                //     Name: 'प्रणव पाटील',
                //     No: 1,
                //     totalmilk: 11.5,
                //     totalRate: 348.56,
                //     morTotalmilk: 3.5,
                //     mortotalRate: 94.9,
                //     eveTotalmilk: 8,
                //     evetotalRate: 253.66,
                //     advance: 10,
                //     bank: 100,
                //     supply: 10,
                //     balance: 3080,
                //     cutting: 120,
                //     amountTogiven: 228.56,
                //     inv_no: '1|2022-11-21|2022-11-30',
                //     from: 2022-11-21T00:00:00.000Z,
                //     to: 2022-11-30T00:00:00.000Z,
                //     generatedOn: 2022-12-02T00:00:00.000Z,
                //     UId: '62b9d7731a35701d0f8efc74',
                //     __v: 0
                //   }
                let regPDF = res.render('BillPdf', result, async (err, data) => {
                    if (err) {
                        console.log("ERROR", err);
                        Object.assign(obj_response, { status: 'fail' }, { result: err });
                        return obj_response;
                    } else {
                        if (fs.existsSync(`${process.cwd()}/PDFs/${fileName}`)) {
                            fs.unlink(`${process.cwd()}/PDFs/${fileName}`, function (err) {
                                if (err) throw err;
                                console.log('File deleted!');
                            });
                        }
                        pdf.create(data, options).toStream(function (err, stream) {
                            stream.pipe(fs.createWriteStream(`${process.cwd()}/PDFs/${fileName}`));
                        })
                    }
                });
                const isFile = await obj_pdfData.holdBeforeFileExists(`${process.cwd()}/PDFs/${fileName}`, 10000)
                if (isFile) {
                    console.log("File Saved!!", path.normalize(`${process.cwd()}/PDFs/${fileName}`));
                    Object.assign(obj_response, { status: 'success' }, { result: `PDFs/${fileName}` });
                    return obj_response;
                }
            } else {
                Object.assign(obj_response, { status: 'success' }, { result: 'Data Not Exist' });
                return obj_response;
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }
}
module.exports = clsBillData;