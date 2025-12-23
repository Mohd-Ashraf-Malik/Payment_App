const { Router} = require('express');
const {jwtValidate} = require('../middleware/auth.js');
const {getBalance,transferBalance, getTransactions} = require("../controller/account");
const { transferLimiter } = require("../middleware/rateLimiter");

const { Transaction } = require('../db');

const app = new Router();
app.use(jwtValidate);

app.get("/balance",getBalance);
app.post("/transfer",transferLimiter,transferBalance);
app.get("/transactions",getTransactions);
module.exports = app;