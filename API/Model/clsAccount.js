const date = require('date-and-time');
const collection = require("../../Schemas/doc_advance");

class clsAdvance {
    async getAccount(req) {
        try {
            let obj_response = {};
            let now = new Date();
            const data = {
                UId: req.UId,
                No: req.No,
                type: req.type
            };
            const doc = await collection.find(data);
            const balance = await this.getTotalBalance(data);
            if (doc.length > 0) {
                Object.assign(obj_response, { status: 'success' }, { result: doc }, { balance: balance.result });
                return obj_response;
            } else {
                Object.assign(obj_response, { status: 'success' }, { result: "No data found" });
                return obj_response;
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    };

    async postAdvance(req) {
        try {
            let obj_response = {};
            let now = new Date();
            let today = date.format(now, 'YYYY-MM-DD');
            let balReq = {
                type: req.type,
                No: req.No,
                UId: req.UId
            };
            const balance = await this.getTotalBalance(balReq);
            let addAmount = (req.addAmount) ? req.addAmount : 0
            let cutAmount = (req.cutAmount) ? req.cutAmount : 0
            let sum = balance.result + addAmount - cutAmount
            const data = {
                type: req.type,
                addAmount: req.addAmount,
                cutAmount: req.cutAmount,
                balance: sum,
                date: new Date(today),
                No: req.No,
                rate: req.rate,
                bag: req.bag,
                Name: req.Name,
                supType: req.supType,
                UId: req.UId
            };
            let createdData = await collection.create(data);
            if (Object.keys(createdData).length !== 0) {
                Object.assign(obj_response, { status: 'success' }, { result: "Data Added Successfully" });
                return obj_response;
            } else {
                Object.assign(obj_response, { status: 'success' }, { result: "Something Went Wrong" });
                return obj_response;
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    };

    async postSupply(req) {
        try {
            let obj_response = {};
            let balReq = {
                type: req.type,
                No: req.No,
                UId: req.UId
            };
            const balance = await this.getTotalBalance(balReq);
            let addAmount = (req.addAmount) ? req.addAmount : 0
            let cutAmount = (req.cutAmount) ? req.cutAmount : 0
            let sum = balance.result + addAmount - cutAmount
            const data = {
                type: req.type,
                addAmount: req.addAmount,
                cutAmount: req.cutAmount,
                date: new Date(req.date),
                balance: sum,
                No: req.No,
                rate: req.rate,
                bag: req.bag,
                supType: req.supType,
                UId: req.UId
            };
            let createdData = await collection.create(data);
            if (Object.keys(createdData).length !== 0) {
                Object.assign(obj_response, { status: 'success' }, { result: "Data Added Successfully" });
                return obj_response;
            } else {
                Object.assign(obj_response, { status: 'success' }, { result: "Something Went Wrong" });
                return obj_response;
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    };

    async getTotalBalance(req) {
        try {
            let obj_response = {};
            let now = new Date();
            const data = {
                UId: req.UId,
                No: req.No,
                type: req.type
            };
            const doc = await collection.find(data);
            if (doc.length > 0) {
                let sum = 0
                doc.forEach(ele => {
                    if (ele.addAmount) {
                        sum += ele.addAmount
                    } else if (ele.cutAmount) {
                        sum -= ele.cutAmount
                    };
                })
                Object.assign(obj_response, { status: 'success' }, { result: sum });
                return obj_response;
            } else {
                Object.assign(obj_response, { status: 'success' }, { result: 0 });
                return obj_response;
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    };
};

module.exports = clsAdvance;