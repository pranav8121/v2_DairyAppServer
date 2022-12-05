const express = require('express');
const bodyParser = require('body-parser');
const { mongoose } = require('./db');
const cors = require('cors');
const app = express();
const path = require('path')
var server = require('http').Server(app);
// const arrSocket = require('./API/arrSocket');
// const WebSocketHandler = require('./API/WebSocket/controller/socketHandler');
const credential = require("./Schemas/doc_login");
// var io = require('socket.io')(server, {
//     cors: {
//         origin: "*",
//         credentials: true
//     }
// });
// var connectionData = "1234";
app.set('view engine', 'ejs');

const middelware = require('./API/Middelware/checkConnection');

const login = require('./API/Route/routelogin');
const member = require('./API/Route/routeMember');
const dailyData = require('./API/Route/routeDailyData');
const bill = require('./API/Route/routeBill');
const account = require('./API/Route/routeAccount');
const dairyData = require('./API/Route/routeDairyData');
const sales = require('./API/Route/routeSales');
const truncate = require('./API/Route/routeTruncate');
const pdf = require('./API/Route/routePdf');



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '')));
app.use(bodyParser.json());
app.use(cors());
app.use(middelware.checkConnection);
app.use('/API/Login', login);
app.use('/API/Member', member);
app.use('/API/DailyData', dailyData);
app.use('/API/Bill', bill);
app.use('/API/Account', account);
app.use('/API/Sales', sales);
app.use('/API/DairyData', dairyData);
app.use('/API/TruncateCollection', truncate);
app.use('/API/pdf', pdf);

setInterval(async () => {
    await credential.updateMany({ active: 1, loginCounter: { $lt: 20 } }, { $inc: { loginCounter: 1 } });
    await credential.updateOne({ loginCounter: { $gte: 20 } }, { $set: { active: 0, Host_Token1: '', loginCounter: 0 } });
}, 3000)
// io.on('connection', (socket) => {
//     console.log("Client Connecteda")
//     socket.on("doneEvent", (data) => {
//         connectionData = data.token;
//         if (data.msg == 'success') {
//             if (!arrSocket.arrWebSocket.includes(connectionData) && connectionData !== "") {
//                 arrSocket.arrWebSocket.push(connectionData);
//             }
//         } else if (data.msg == 'user logout') {
//             console.log(data.msg);
//             arrSocket.arrWebSocket.splice(arrSocket.arrWebSocket.indexOf(connectionData), 1);
//         }


//         const arr = arrSocket.arrWebSocket
//     });

//     setInterval(() => {
//         socket.emit('testEvent', "Connection is live");
//     }, 3000);


//     socket.on('disconnect', () => {
//         arrSocket.arrWebSocket.splice(arrSocket.arrWebSocket.indexOf(connectionData), 1);
//         WebSocketHandler.handleSocket(connectionData);
//     });

// });

process.on('exit', async function () {
    await credential.update({ 'active': 1 }, { $set: { 'active': 0, Host_Token1: '' } });
    console.log("Exit");
    process.emit('cleanup');
});

// catch ctrl+c event and exit normally
process.on('SIGINT', async function () {
    await credential.update({ 'active': 1 }, { $set: { 'active': 0, Host_Token1: '' } })
    console.log('Ctrl-C...');
    process.exit(2);
});

process.on('uncaughtException', async function (e) {
    await credential.update({ 'active': 1 }, { $set: { 'active': 0, Host_Token1: '' } })
    console.log('Uncaught Exception...');
    console.log(e.stack);
    process.exit(99);
});


server.listen(process.env.PORT || 3001, () => {
    console.log('server started at http://localhost:3001/')
});