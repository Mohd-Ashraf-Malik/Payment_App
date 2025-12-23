const { User } = require("../db");

async function adminOnly(req, res, next) {
  const user = await User.findById(req.userId);

  if (!user || user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  next();
}

module.exports = { adminOnly };
