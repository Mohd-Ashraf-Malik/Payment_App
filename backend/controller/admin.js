const { AuditLog } = require("../db");
const { reconcileAllAccounts } = require("../utils/reconcileAll");

async function getAuditLogs(req, res) {
  const filter = {};

  if (req.query.userId) {
    filter.userId = req.query.userId;
  }

  if (req.query.action) {
    filter.action = req.query.action;
  }

  if (req.query.from || req.query.to) {
    filter.createdAt = {};
    if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
    if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
  }

  const logs = await AuditLog.find(filter)
    .sort({ createdAt: -1 })
    .limit(100);

  res.json({ logs });
}

async function runReconciliation(req, res) {
  const mismatches = await reconcileAllAccounts();

  res.json({
    mismatchesCount: mismatches.length,
    mismatches
  });
}

module.exports = {
  getAuditLogs,
  runReconciliation
};