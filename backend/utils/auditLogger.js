const { AuditLog } = require("../db");

async function logAudit({
  userId,
  action,
  metadata,
  req,
  session
}) {
  await AuditLog.create([{
    userId,
    action,
    metadata,
    ip: req.ip,
    userAgent: req.headers["user-agent"]
  }], session ? { session } : {});
}

module.exports = { logAudit };
