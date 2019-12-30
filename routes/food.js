const express = require('express')
const router = express.Router()
const database = require('../db_config')
var bcrypt = require('bcryptjs');
const { getToken, verifyToken } = require('../jwtHandler');

const result_failed = {
    type: "failed",
    data: ""
  };

//get all food
router.get('/api/v1/foods',  verifyToken,  (req, res) => {
    const queryString = "SELECT FOOD_ID,FOOD_NAME,FOOD_UNIT,FOOD_KCAL,FOODTYPE_NAME FROM FOOD,FOODTYPE WHERE FOOD.FOODTYPE_ID = FOODTYPE.FOODTYPE_ID";
    database.conn.query( queryString, (err, rows, fields) => {
        if (err) {
            console.log('Failed to query for foods : ' + err)
            res.sendStatus(500)
            res.end()
            // throw err
        }
        console.log('fetched foods sucessful')
        const result = { auth: true, data: rows }
        res.json(result)
    })
})

//get food by foodtypeId
router.get('/api/v1/food/:id', verifyToken, (req, res) => {
    const foodtypeId = req.params.id;
    console.log('get food by foodtype = ' + foodtypeId)
    const queryString = "SELECT FOOD_ID,FOOD_NAME,FOOD_KCAL,FOOD_UNIT,FOODTYPE_NAME FROM FOOD,FOODTYPE WHERE FOOD.FOODTYPE_ID = FOODTYPE.FOODTYPE_ID AND FOOD.FOODTYPE_ID = ?";
    database.conn.query( queryString, [foodtypeId], (err, rows, fields) => {
        if (err) {
            console.log('Failed to query for foods : ' + err)
            res.sendStatus(500)
            res.end()
            // throw err
        }
        console.log('fetched food sucessful')
        const result = { auth: true, data: rows }
        res.json(result)
    })
}) 

//get all foodtype
router.get('/api/v1/foodtypes', verifyToken, (req, res) => {
    const queryString = "SELECT FOODTYPE_ID, FOODTYPE_NAME FROM FOODTYPE";
    database.conn.query( queryString, (err, rows, fields) => {
        if (err) {
            console.log('Failed to query for foodtypes : ' + err)
            res.sendStatus(500)
            res.end()
            // throw err
        }
        console.log('fetched foodtypes sucessful')
        const result = { auth: true, data: rows }
        res.json(result)
    })
})

//get all food by search
router.post('/api/v1/search_food/',  verifyToken,  (req, res) => {
    const foodname = '%' + req.body.foodname + '%';
    const queryString = "SELECT FOOD_ID,FOOD_NAME,FOOD_UNIT,FOOD_KCAL,FOODTYPE_NAME FROM FOOD,FOODTYPE WHERE FOOD.FOODTYPE_ID = FOODTYPE.FOODTYPE_ID AND FOOD_NAME LIKE ?";
    database.conn.query( queryString, [foodname],(err, rows, fields) => {
        if (err) {
            console.log('Failed to query for foods : ' + err)
            res.sendStatus(500)
            res.end()
            // throw err
        }
        console.log('fetched search food sucessful' + foodname)
        const result = { auth: true, data: rows }
        res.json(result)
    })
})


module.exports = router