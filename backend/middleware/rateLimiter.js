const rateLimit = require("express-rate-limit");
const { ipKeyGenerator } = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: {
    message: "Too many login attempts. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});

const transferLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    // ✅ Prefer userId, fallback to SAFE IP generator
    return req.userId ? `user:${req.userId}` : ipKeyGenerator(req);
  },
  message: {
    message: "Too many transfer attempts. Please slow down."
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = {
  loginLimiter,
  transferLimiter
};
