var jwt = require('jsonwebtoken');

const secretKey = "carecruch.chimdolin.me"

function getToken(json) {

  return token = jwt.sign(json, secretKey, {

    expiresIn: 8640000 // expires in 24 hours

  });

}

function verifyToken(req, res, next) {

    console.log("Verify Token: " + JSON.stringify(req.headers));

    var token = req.headers['x-access-token'];


    if (!token)

      return res.status(403).send({ auth: false, message: 'ไม่พบ token' });

    jwt.verify(token, secretKey, function (err, decoded) {

      if (err)

        return res.status(500).send({ auth: false, message: 'token ไม่ถูกต้อง' });

      // if everything good, save to request for use in other routes

      req.userId = decoded.id;

      next();

    });

  }
  
  module.exports = { getToken, verifyToken };