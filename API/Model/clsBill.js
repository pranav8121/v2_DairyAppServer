const date = require('date-and-time');
const collection = require("../../Schemas/doc_bills");
const clsDailyData = require('./clsDailyData');
const obj_dailyData = new clsDailyData();
const clsAccount = require('./clsAccount');
const obj_Account = new clsAccount();

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
                    if (res1 == "Data Added Successfully" && res2 == "Data Added Successfully") {
                        Object.assign(obj_response, { status: 'success' }, { result: "Data Added Successfully" });
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

    async getExistBillData(req) {
        try {
            let obj_response = {};
            let now = new Date();
            let today = date.format(now, 'YYYY-MM-DD');
            let dates = obj_dailyData.getLastBill();
            let data = {
                UId: req.UId,
                No: req.No,
                from: new Date(dates.from),
                to: new Date(dates.to)
            }
            let result = await collection.findOne(data);
            if (result) {
                Object.assign(obj_response, { status: 'success' }, { result: result });
                return obj_response;
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