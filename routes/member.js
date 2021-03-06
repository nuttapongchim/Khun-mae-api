const express = require('express')
const router = express.Router()
const database = require('../db_config')
var bcrypt = require('bcryptjs');
const { getToken, verifyToken } = require('../jwtHandler');

const result_failed = {
    type: "failed",
    data: ""
};

//get all member
router.get('/api/v1/members', verifyToken, (req, res) => {
    const queryString = "SELECT * FROM MEMBER";
    database.conn.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log('Failed to query for members : ' + err)
            res.sendStatus(500)
            res.end()
            // throw err
        }
        console.log('fetched sucessful')
        const result = { auth: true, data: rows }
        res.json(result)
    })
})

// get member by id
router.get('/api/v1/member/:id', verifyToken, (req, res) => {
    const memberId = req.params.id;
    const queryString = "SELECT * FROM MEMBER WHERE MEMBER_ID = ?";
    database.conn.query(queryString, [memberId], (err, rows, fields) => {
        if (err) {
            console.log('Failed to query for members by id : ' + err)
            res.sendStatus(500)
            res.end()
            // throw err
        }
        console.log('fetched sucessful')
        const result = { auth: true, data: rows }
        res.json(result)
    })
})

//create member
router.post('/api/v1/create_member', (req, res) => {
    const username = req.body.username;
    const password = bcrypt.hashSync(req.body.password, 8);
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const birthdate = req.body.birthdate;
    const weight = req.body.weight;
    const height = req.body.height;
    const gestation_age = req.body.gestation_age;
    console.log('weight = ' + weight + 'height = ' + height)
    const bmi = weight / ((height / 100) * (height / 100));
    const create_date = new Date();
    const queryString = "INSERT INTO `MEMBER` (MEMBER_USERNAME,MEMBER_PASSWORD,MEMBER_FIRSTNAME,MEMBER_LASTNAME,MEMBER_WEIGHT,MEMBER_HEIGHT,MEMBER_GESTATION_AGE,MEMBER_BMI,MEMBER_BIRTHDATE,CREATE_BY,CREATE_DATE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    database.conn.query(queryString, [username, password, firstname, lastname, weight, height, gestation_age, bmi, birthdate, username, create_date], (err, results, fields) => {
        if (err) {
            console.log('Failed to create member : ' + err)
            res.json(result_failed)
            return
        }

        console.log("A new member with id : " + results.insertId + ' : ' + username)
        const result = {
            type: "success",
            data: results.insertId
        };
        res.json(result)
        res.end()
    })
})

//check member
router.get('/api/v1/check_member/:username', (req, res) => {
    const username = req.params.username;
    const queryString = "SELECT MEMBER_USERNAME FROM MEMBER WHERE MEMBER_USERNAME = ?";
    database.conn.query(queryString, [username], (err, rows, fields) => {
        if (err) {
            console.log('Failed to query for members : ' + err)
            res.sendStatus(500)
            res.end()
            // throw err
        }
        console.log('fetched sucessful')

        const result = { auth: true, data: rows }

        if (result.data.length > 0) {
            console.log('username already ! ')
        } else {
            console.log(`username : ${username}`)
        }

        res.json(result)
    })
})

//check login
router.post('/api/v1/check_login', (req, res) => {
    const username = req.body.username
    console.log(`username = ${username}`)
    const password = req.body.password
    const queryString = "SELECT MEMBER_ID, MEMBER_USERNAME, MEMBER_PASSWORD, MEMBER_GESTATION_AGE,MEMBER_WEIGHT, CREATE_DATE FROM MEMBER WHERE MEMBER_USERNAME = ?"
    database.conn.query(queryString, [username], (err, results, fields) => {
        if (err) {
            console.log('Failed to create member : ' + err)
            return res.json(result_failed)
        }
        if (results.length > 0) {
            const passwordIsValid = bcrypt.compareSync(password, results[0].MEMBER_PASSWORD);
            if (!passwordIsValid) return res.json(result_failed)
            var _username = results[0].MEMBER_USERNAME;
            var _id = results[0].MEMBER_ID;
            var _gestationAge = results[0].MEMBER_GESTATION_AGE;
            var _createDate = results[0].CREATE_DATE;
            var _weight = results[0].MEMBER_WEIGHT;
            console.log('=_gestationAge = ' + _gestationAge)
            var token = getToken({ id: _id, username: _username })
            const result = {
                type: "success",
                userToken: token,
                userId: _id,
                username: _username,
                gestationAge: _gestationAge,
                createDate: _createDate,
                weight: _weight
            };
            console.log(JSON.stringify(result));
            return res.json(result);
        } else {
            console.log(JSON.stringify(result_failed));
            return res.json(result_failed)
        }
    })
})

// update member
router.put('/api/v1/edit_member', (req, res) => {
    const memberId = req.body.userId
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const birthdate = req.body.birthdate
    const weight = req.body.weight;
    const height = req.body.height;
    const gestation_age = req.body.gestation_age;
    const bmi = weight / ((height / 100) * (height / 100));

    console.log(birthdate)

    const queryString = "UPDATE MEMBER SET MEMBER_FIRSTNAME = ?, MEMBER_LASTNAME = ?,MEMBER_BIRTHDATE = ?,MEMBER_WEIGHT = ?,MEMBER_HEIGHT = ?,MEMBER_BMI = ?, MEMBER_GESTATION_AGE = ? WHERE MEMBER_ID = ?"

    database.conn.query(queryString, [firstname, lastname, birthdate, weight, height, bmi, gestation_age, memberId], (err, results, fields) => {
        if (err) {
            console.log('Failed to create edit member id : ' + err)
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

// delete member 
router.delete('/api/v1/delete_member/:id', verifyToken, (req, res) => {
    const memberId = req.body.id;
    const queryString = "DELETE FROM MEMBER WHERE MEMBER_ID = ?"
    database.conn.query(queryString, [memberId], (err, results, fields) => {
        if (err) {
            console.log('Failed to delete member by id : ' + err)
            res.sendStatus(500)
            return
        }
        console.log("An delete with id : " + results.insertId)
        res.status(204).send()
        res.end()
    })
})

module.exports = router