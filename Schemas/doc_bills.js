const mongoose = require('mongoose')
var today = new Date()

module.exports = mongoose.model('Bill', {
    Name: { type: String },
    No: { type: Number },
    totalmilk: { type: Number },
    totalRate: { type: Number },
    morTotalmilk: { type: Number },
    mortotalRate: { type: Number },
    eveTotalmilk: { type: Number },
    evetotalRate: { type: Number },
    advance: { type: Number },
    bank: { type: Number },
    supply: { type: Number },
    balance: { type: Number },
    cutting: { type: Number },
    amountTogiven: { type: Number },
    inv_no: { type: String },
    from: { type: Date },
    to: { type: Date },
    generatedOn: { type: Date, default: today },
    UId: { type: String }
});