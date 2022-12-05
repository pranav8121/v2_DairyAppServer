const date = require('date-and-time');
const path = require('path');
const ejs = require('ejs');
const pdf = require('html-pdf')
var options = { format: 'Letter' };
const fs = require('fs')
class clsPDFData {

    async getBillPdf(req, res) {
        try {
            let obj_response = {};
            let now = new Date();
            var fileName = 'BillKapila.pdf';
            var savedFileName;
            let regPDF = res.render('BillPdf', async (err, data) => {
                if (err) {
                    console.log("ERROR", err);
                    Object.assign(obj_response, { status: 'fail' }, { result: err });
                    return obj_response;
                } else {
                    if (fs.existsSync(`${process.cwd()}/PDFs/${fileName}`)) {
                        fs.unlink(`${process.cwd()}/PDFs/${fileName}`, function (err) {
                            if (err) throw err;
                            // if no error, file has been deleted successfully
                            console.log('File deleted!');
                        });
                    }
                    // pdf.create(data, options).toFile(path.normalize(`${process.cwd()}/PDFs/${fileName}`), function (err, res) {
                    //     if (err) {
                    //         return console.log(err);
                    //     }
                    //     else {
                    //         savedFileName = res
                    //     }
                    // });
                    pdf.create(data, options).toStream(function (err, stream) {
                        stream.pipe(fs.createWriteStream(`${process.cwd()}/PDFs/${fileName}`));
                    })
                }
            });
            const isFile = await this.holdBeforeFileExists(`${process.cwd()}/PDFs/${fileName}`, 10000)
            if (isFile) {
                console.log("File Saved!!", path.normalize(`${process.cwd()}/PDFs/${fileName}`));
                Object.assign(obj_response, { status: 'success' }, { result: path.normalize(`${process.cwd()}/PDFs/${fileName}`) });
                res.send(obj_response);
            }
        }
        catch (err) {
            console.log(err);
            return err;
        }
    }

    async holdBeforeFileExists(filePath, timeout) {
        timeout = timeout < 1000 ? 1000 : timeout
        try {
            var nom = 0
            return new Promise(resolve => {
                var inter = setInterval(() => {
                    nom = nom + 100
                    if (nom >= timeout) {
                        clearInterval(inter)
                        //maybe exists, but my time is up! 
                        resolve(false)
                    }

                    if (fs.existsSync(filePath) && fs.lstatSync(filePath).isFile()) {
                        clearInterval(inter)
                        //clear timer, even though there's still plenty of time left
                        resolve(true)
                    }
                }, 100)
            })
        } catch (error) {
            return false
        }
    }
}
module.exports = clsPDFData;