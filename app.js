// load our app server using express..

const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

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
}))

//config route
const routerMember = require('./routes/member')
app.use(routerMember)
const routerFood = require('./routes/food')
app.use(routerFood)
const routerRecord = require('./routes/record')
app.use(routerRecord)

// static page
app.use(express.static('./public'))

// check status
app.use(morgan('short'))

// get default page
app.get('/', (req, res) => {
    const html = '<html style="color:#fff;background-color:#272C35; text-align:center; justify-content:center;"><h1>HELLO WR@LD <br> #CARECRUCH_API_V1</h1></html>'
    res.send(html)
    res.end()
})

const server = app.listen(3003, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('API Running ... ' + host + ':' + port);
})