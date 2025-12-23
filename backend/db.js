const mongoose = require('mongoose');
require("dotenv").config();
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB Connected');
});

mongoose.connection.on('error', (err) => {
  console.log('❌ MongoDB Error:', err);
});

mongoose.connect(process.env.DB_URL);

const User = require('./model/user.model.js');
const Account = require('./model/account.model.js');
const Transaction = require('./model/transaction.model.js'); 
const Idempotency = require("./model/idempotency.model.js");
const AuditLog = require("./model/auditlog.model.js");
const Ledger = require("./model/Ledger.model.js");

module.exports = {
  User,
  Account,
  Transaction,
  Ledger,
  Idempotency,
  AuditLog,
  mongoose
};