const { Router } = require("express");
const { getAuditLogs, runReconciliation } = require("../controller/admin");
const { jwtValidate } = require("../middleware/auth.js");
const { adminOnly } = require("../middleware/adminOnly.js");
const app = new Router();

app.get("/audit-logs", jwtValidate, adminOnly, getAuditLogs);

app.post("/reconcile", jwtValidate, adminOnly, runReconciliation);

module.exports = app;
