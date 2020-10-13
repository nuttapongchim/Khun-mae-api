const express = require('express')
const router = express.Router()
const database = require('../db_config')
const { getToken, verifyToken } = require('../jwtHandler');

const result_failed = {
    type: "failed",
    data: ""
};

//get all record food
router.get('/api/v1/get_record_foods/:id/:month', verifyToken, (req, res) => {
    const memberId = req.params.id;
    const month = req.params.month;
    console.log('member id = ' + memberId + 'month = ' + month)
    const queryString = "SELECT DATE_FORMAT(RECORD_DATE, '%Y-%m-%d') AS RECORD_DATE , SUM(FOOD.FOOD_KCAL * RECORD_FOOD.FOOD_QTY) AS SUM_KCAL FROM RECORD_FOOD,FOOD WHERE RECORD_FOOD.FOOD_ID = FOOD.FOOD_ID AND MEMBER_ID = ? AND MONTH(RECORD_DATE) = ? GROUP BY DATE_FORMAT(RECORD_DATE, '%Y-%m-%d') ORDER BY DATE_FORMAT(RECORD_DATE, '%Y-%m-%d') DESC";
    database.query(queryString, [memberId, month], (err, rows, fields) => {
        if (err) {
            console.log('Failed to query for record foods : ' + err)
            res.sendStatus(500)
            res.end()
            // throw err
        }
        console.log('fetched record foods sucessful')

        const result = { auth: true, data: rows }
        res.json(result)
    })
})

//get record food by date
router.get('/api/v1/get_record_food/:id/:date', verifyToken, (req, res) => {
    const memberId = req.params.id;
    const date = req.params.date;
    console.log('get_record_food/:id/:date' + memberId)
    const queryString = "SELECT RECORD_ID,RECORD_FOOD.FOOD_ID,FOOD_QTY,FOOD_NAME,FOOD_UNIT,FOOD_KCAL,FOODTYPE_NAME FROM RECORD_FOOD,FOOD,FOODTYPE WHERE RECORD_FOOD.FOOD_ID = FOOD.FOOD_ID AND FOOD.FOODTYPE_ID = FOODTYPE.FOODTYPE_ID AND MEMBER_ID = ? AND DATE_FORMAT(RECORD_DATE, '%Y-%m-%d') = ?";
    database.query(queryString, [memberId, date], (err, rows, fields) => {
        if (err) {
            console.log('Failed to query for record food : ' + err)
            res.sendStatus(500)
            res.end()
            // throw err
        }
        console.log('fetched record food sucessful')

        const result = { auth: true, data: rows }
        res.json(result)
    })
})

//get record weight by id
router.get('/api/v1/get_record_weight/:id', verifyToken, (req, res) => {
    const memberId = req.params.id;
    console.log('get_record_food/:id/:date' + memberId)
    const queryString = "SELECT RECORD_VALUE,RECORD_DATE FROM RECORD_WEIGHT WHERE MEMBER_ID = ? ORDER BY RECORD_DATE";
    database.query(queryString, [memberId], (err, rows, fields) => {
        if (err) {
            console.log('Failed to query for record weight : ' + err)
            res.sendStatus(500)
            res.end()
            // throw err
        }
        console.log('fetched record food sucessful')

        const result = { auth: true, data: rows }
        res.json(result)
    })
})

//record food
router.post('/api/v1/record_food/', verifyToken, (req, res) => {
    const foodId = req.body.foodId;
    const userId = req.body.userId;
    const foodQty = req.body.foodQty
    const record_date = req.body.date;
    const create_by = req.body.username;
    const create_date = new Date();

    console.log(foodId + ',' + userId + ',' + create_by + ',' + create_date)

    const queryString = "INSERT INTO RECORD_FOOD (FOOD_ID,FOOD_QTY,MEMBER_ID,RECORD_DATE,CREATE_BY,CREATE_DATE) VALUES (?, ?, ?, ?, ?, ?)";
    database.query(queryString, [foodId, foodQty, userId, record_date, create_by, create_date], (err, results, fields) => {
        if (err) {
            console.log('Failed to create record food : ' + err)
            res.json(result_failed)
            return
        }
        console.log("Record foodId : " + results.insertId)
        const result = {
            type: "success",
            data: results.insertId
        };
        res.json(result)
        res.end()
    })
})

// record weight
router.post('/api/v1/record_weight/', verifyToken, (req, res) => {
    const userId = req.body.userId;
    const weight = req.body.weight;
    const record_date = req.body.date;
    const create_by = req.body.username;
    const create_date = new Date();
    const log_id = req.body.log_id;

    console.log(weight + ',' + userId + ',' + record_date + ',' + create_by + ',' + create_date)

    const queryString = "INSERT INTO RECORD_WEIGHT (RECORD_VALUE,MEMBER_ID,RECORD_DATE,CREATE_BY,CREATE_DATE) VALUES (?, ?, ?, ?, ?)";
    database.query(queryString, [weight, userId, record_date, create_by, create_date], (err, results, fields) => {
        if (err) {
            console.log('Failed to create record weight id : ' + err)
            res.json(result_failed)
            return
        }
        var queeyString = database.conn.query("UPDATE log_record_weight SET is_recorded = 'Y' WHERE member_id = ? AND id_log_record_weight = ?",[userId,log_id],(error,result)=>{
         if(error){
             console.log(queeyString.sql);
             console.log('Failed to update log record weight id : ' + err);
             res.json(result_failed);
             return
         }
            res.json({
                type: "success",
                data: result
            });
            res.end()
        })
    })
});

// edit record weight
router.put('/api/v1/edit_record_weight/', verifyToken, (req, res) => {
    const userId = req.body.userId;
    const weight = req.body.weight;
    const date = req.body.date;

    console.log(`edit weight userid = ${userId}, weight = ${weight}, date = ${date}`)

    const queryString = "UPDATE RECORD_WEIGHT SET RECORD_VALUE = ? WHERE MEMBER_ID = ? AND RECORD_DATE = ?";
    database.query(queryString, [weight, userId, date], (err, results, fields) => {
        if (err) {
            console.log('Failed to create record weight id : ' + err)
            res.json(result_failed)
            return
        }
        const result = {
            type: "success",
            data: results.insertId
        };
        res.json(result)
        res.end()
    })
})

// delete record food by id
router.delete('/api/v1/delete_record_food/:id', verifyToken, (req, res) => {
    const recordId = req.params.id;
    console.log("redcord id = " + recordId)
    const queryString = "DELETE FROM RECORD_FOOD WHERE RECORD_ID = ?"
    database.query(queryString, [recordId], (err, results, fields) => {
        if (err) {
            console.log('Failed to delete food record by id : ' + err)
            res.sendStatus(500)
            return
        }
        console.log("An delete with id : " + JSON.stringify(results))
        const result = {
            type: "success",
            data: results
        };
        res.json(result)
        res.end()
    })
})


module.exports = router
