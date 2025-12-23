const { Router } = require('express');
const { signup,login,updateUser,findUser,isAuthenticated,getUserDetails } = require('../controller/user');
const {jwtValidate} = require('../middleware/auth.js');
const { loginLimiter } = require("../middleware/rateLimiter");

const app = Router();

app.post("/signin", loginLimiter, login);

app.post("/signup", signup);

app.put("/update", jwtValidate, updateUser);

app.get("/bulk",jwtValidate, findUser);

app.get("/me", jwtValidate, isAuthenticated);

app.get("/profile", jwtValidate, getUserDetails);
module.exports = app;