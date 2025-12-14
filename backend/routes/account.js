const { Router} = require('express');
const {jwtValidate} = require('../middleware');
const {getBalance,transferBalance, getTransactions} = require("../controller/account");
const { Transaction } = require('../db');

const app = new Router();
app.use(jwtValidate);

app.get("/balance",getBalance);
app.post("/transfer",transferBalance);
app.get("/transactions",getTransactions);
module.exports = app;