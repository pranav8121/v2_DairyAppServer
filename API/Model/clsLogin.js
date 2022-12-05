const date = require('date-and-time');
const collection = require("../../Schemas/doc_login");
const memCollection = require("../../Schemas/doc_member");

class Login {
    // Dairy Auth
    async getallDairyCred() {
        try {
            let obj_response = {};
            let now = new Date();
            const a = await collection.find({})
            Object.assign(obj_response, { status: 'success' }, { result: a })
            return obj_response
        }
        catch (err) {
            console.log(err);
            return err
        }
    }

    async browserClosed() {
        try {
            console.log("User Closed The Browser");
        } catch (err) {
            return err
        }
    }

    async AuthDairy(req) {
        try {
            let obj_response = {};
            let now = new Date();

            const doc = await collection.find({ 'username': req.username })
            if (doc.length == 0) {
                Object.assign(obj_response, { status: 'success' }, { result: "Username does not exist" })
                return obj_response
            }
            else {
                const data = doc[0]
                if (req.password == data.password) {
                    if (data.active == 0) {
                        const loginCounter = data.loginCounter + 1
                        // const val = data.active + 1
                        let token = `${data._id}-${loginCounter}-${data.username}`
                        let update;
                        // if (data.active == 0) {
                        update = await collection.updateOne({ username: data.username }, { $set: { active: 1, Host_Token1: token, loginCounter: loginCounter } });
                        // }
                        // else if (data.active == 1) {
                        //     update = await collection.updateOne({ username: data.username }, { $set: { active: val, Host_Token2: token, loginCounter: loginCounter } });
                        // }
                        if (update.modifiedCount == 1) {
                            Object.assign(obj_response, { status: 'success' }, { result: "Login SuccessFull" }, { details: data }, { token: token })
                            return obj_response
                        }
                        else {
                            Object.assign(obj_response, { status: 'success' }, { result: "NA" })
                            return obj_response
                        }
                    }
                    else {
                        Object.assign(obj_response, { status: 'success' }, { result: "User Already Active" })
                        return obj_response
                    }
                }
                else {
                    Object.assign(obj_response, { status: 'success' }, { result: "Invalid Username or password" })
                    return obj_response
                }
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    async CreateAuthDairy(req) {
        try {
            let obj_response = {};
            let now = new Date();
            const doc = await collection.find({ 'username': req.username })
            if (doc.length == 0) {
                Object.assign(obj_response, { status: 'success' }, { result: "Username Already not exist" })
                return obj_response
            } else {
                let data = {
                    username: req.username,
                    password: req.password,
                    Name: req.name,
                    multi: req.multi,
                    active: 0,
                    loginCounter: 0
                };
                const createdData = await collection.create(data)
                if (Object.keys(createdData).length !== 0) {
                    Object.assign(obj_response, { status: 'success' }, { result: "Credential Added Successfuly" }, { detail: createdData })
                    return obj_response
                }
                else {
                    Object.assign(obj_response, { status: 'success' }, { result: "NA" })
                    return obj_response
                }
            }
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    async logoutDairy(req) {
        try {
            let obj_response = {};
            let now = new Date();
            console.log("Logging Out...", req.username);
            const doc = await collection.find({ 'username': req.username });
            const data = doc[0]
            if (doc.length == 1) {
                let token = req.token
                console.log("Data", data);
                // Check If User Is Active
                if (data.active == 0) {
                    Object.assign(obj_response, { status: 'success' }, { result: "User Not Active" })
                    return obj_response
                } else {
                    // let val = data.active - 1;
                    let update;
                    // Check which User Is Active 
                    // if (data.Host_Token1 == token) {
                    update = await collection.updateOne({ username: data.username }, { $set: { active: 0, Host_Token1: '' } });
                    // }
                    // else if (data.Host_Token2 == token) {
                    //     update = await collection.updateOne({ username: data.username }, { $set: { active: val, Host_Token2: '' } });
                    // }
                    // Check if object is modified
                    if (typeof update == 'object') {
                        if (Object.keys(update).length) {
                            if (update.modifiedCount == 1) {
                                Object.assign(obj_response, { status: 'success' }, { result: "Logout SuccessFully" }, { details: data })
                                return obj_response
                            } else {
                                Object.assign(obj_response, { status: 'success' }, { result: "x" })
                                return obj_response
                            }
                        }
                    }
                }
            } else {
                Object.assign(obj_response, { status: 'success' }, { result: "NA" })
                return obj_response
            }
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }


    // Member Auth 
    async AuthMember(req) {
        try {
            let obj_response = {};
            let now = new Date();
            const filter = { 'No': req.No, 'UId': req.UId };
            const doc = await memCollection.find(filter);
            if (doc.length == 0) {
                Object.assign(obj_response, { status: 'success' }, { result: "Username does not exist" })
                return obj_response
            }
            else {
                const data = doc[0]
                if (req.password == data.password) {
                    if (data.passwordChanged == 0) {
                        Object.assign(obj_response, { status: 'success' }, { result: "Change The Password" })
                        return obj_response
                    }
                    else {
                        if (data.active < 2) {
                            const val = data.active + 1
                            const update = await memCollection.updateOne(filter, { $set: { active: val } });
                            if (update.modifiedCount == 1) {
                                Object.assign(obj_response, { status: 'success' }, { result: "Login SuccessFull" }, { details: data })
                                return obj_response
                            }
                            else {
                                Object.assign(obj_response, { status: 'success' }, { result: "NA" })
                                return obj_response
                            }
                        } else {
                            Object.assign(obj_response, { status: 'success' }, { result: "User Already Active" })
                            return obj_response
                        }
                    }

                } else {
                    Object.assign(obj_response, { status: 'success' }, { result: "Invalid Username or password" })
                    return obj_response
                }
            }
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    async logoutMember(req) {
        try {
            let obj_response = {};
            let now = new Date();
            const filter = { 'No': req.No, 'UId': req.UId };
            const doc = await memCollection.find(filter)
            const data = doc[0]
            if (doc.length == 1) {
                if (data.active == 0) {
                    Object.assign(obj_response, { status: 'success' }, { result: "Logout SuccessFully" })
                    return obj_response
                } else {
                    let val = data.active - 1
                    const update = await memCollection.updateOne(filter, { $set: { active: val } })
                    if (update.modifiedCount == 1) {
                        Object.assign(obj_response, { status: 'success' }, { result: "Logout SuccessFully" }, { details: data })
                        return obj_response
                    } else {
                        Object.assign(obj_response, { status: 'success' }, { result: "NA" })
                        return obj_response
                    }
                }
            } else {
                Object.assign(obj_response, { status: 'success' }, { result: "NA" })
                return obj_response
            }
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    async checkUserLogin(req) {
        try {
            let obj_response = {};
            let now = new Date();
            const token = req.token
            const a = await collection.find({ $or: [{ Host_Token1: token }, { Host_Token2: token }] });
            if (a.length == 0) {
                Object.assign(obj_response, { status: 'success' }, { result: 0 })
                return obj_response;
            } else {
                Object.assign(obj_response, { status: 'success' }, { result: 1 })
                return obj_response;
            }
        } catch (err) {
            console.log(err)
            return err
        }

    }

    async resetLoginCounter(req) {
        let obj_response = {};
        let updateStat = await collection.updateOne({ username: req.username, 'UId': req.UId }, { $set: { loginCounter: 0 } });
        if (updateStat) {
            Object.assign(obj_response, { status: 'success' }, { result: 1 })
            return obj_response;
        }
        console.log(updateStat);
    }
}

module.exports = Login;