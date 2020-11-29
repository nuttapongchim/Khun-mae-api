// load our app server using express..
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
var CronJob = require('cron').CronJob;
const database = require('./db_config');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

// body - parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//config route
const routerMember = require('./routes/member')
app.use(routerMember)
const routerFood = require('./routes/food')
app.use(routerFood)
const routerRecord = require('./routes/record')
app.use(routerRecord)

// static page
app.use(express.static('./public'));

// check status
app.use(morgan('short'));

// get default page
app.get('/', (req, res) => {
    const html = '<html style="color:#fff;background-color:#272C35; text-align:center; justify-content:center;"><h1>HELLO WR@LD <br> #CARECRUCH_API_V1</h1></html>'
    res.send(html)
    res.end()
});

function sendRequest(token) {
    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://fcm.googleapis.com/fcm/send',
        'headers': {
            'Authorization': 'key=AAAAl6NVZi4:APA91bGrcYuUE1_I-JQcO0Vmd0qlI6O74Y5VOgw4uUkOvqkmQZ-f7WhDK_lrkNrQ_MHTS_H4Zr-65f23i1w4qj0aTSC_dY3ERGNR-epTglYk3cZ_RiuZwnUEosFDTdkc3axabPE7kEi1',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            {
                "to": token, "priority": "high",
                "notification":
                {
                    "body": "ถึงเวลาชั่งน้ำหนักแล้ว คุณแม่",
                    "title": "คุณแม่ ! ถึงเวลาชั่งน้ำหนักแล้ว",
                    "icon": "myicon"
                }
            })

    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    });
}

function InsertLogRecord(id) {
    database.query("INSERT INTO log_record_weight(log_start_record_weight,log_end_record_weight,member_id) values((SELECT DATE_ADD(DATE(NOW()), INTERVAL(-WEEKDAY(DATE(NOW()))) DAY)),(SELECT DATE_ADD(DATE(NOW()), INTERVAL(6-WEEKDAY(DATE(NOW()))) DAY)),?)",
        [
            id
        ]
    );
}
function FetchToken(callback) {
    database.query("SELECT token_notification from MEMBER where token_notification != ''", (error, results) => {
        if (error) {
            callback(error, null)
        } else {
            callback(null, results);
        }
    });
}

function FetchUserId(callback) {
    database.query("SELECT MEMBER_ID FROM MEMBER", (error, result) => {
        if (error) {
            callback(error, null)
        } else {
            callback(null, result)
        }
    })
}


var job = new CronJob('10 01 * * 0', function () {
    try {
        FetchUserId(function (err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log("1_!!!!")
                //console.log(data[i].MEMBER_ID)
                for (let i = 0; i < data.length; i++) {
                    InsertLogRecord(data[i].MEMBER_ID)
                    console.log(data[i].MEMBER_ID)
                }
            }
        });
    } catch (e) {
        console.log(e)
    }
}, null, true, 'Asia/Bangkok');

var SendNotificatonJob = new CronJob('12 01 * * 0', function () {
    try {
        FetchToken(function (err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log("2_!!!!")
                // console.log(data[i].token_notification)
                for (let i = 0; i < data.length; i++) {
                    sendRequest(data[i].token_notification)
                    console.log(data[i].token_notification)
                }
            }
        });
    } catch (e) {
        console.log(e)
    }
}, null, true, 'Asia/Bangkok');

var testCron = new CronJob("* * * * *", function () {
   console.log("It works.")
   console.log(new Date().getHours())
   console.log(new Date().getMinutes())
}, null, true, 'Asia/Bangkok')




job.start();
SendNotificatonJob.start();
testCron.start()

const server = app.listen(3003, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('API Running ... ' + host + ':' + port);
});
