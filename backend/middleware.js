const jwt = require('jsonwebtoken');
const {jwtSecret} = require('./config');
async function jwtValidate(req, res, next) {
    const bauth = req.headers.authorization;
    if(!bauth || !(bauth.startsWith('Bearer '))){
        res.status(403).json({
            message: "user not authorized"
        });
        return
    }
    const jwtToken = bauth.split(' ')[1];
    try{
        const decoded = jwt.verify(jwtToken, jwtSecret);
        req.userId = decoded.userId;
        next();
    } catch(err){
        res.status(403).json({
            message: "user not authorized"
        });
        return
    } 
}

module.exports = {
    jwtValidate
}