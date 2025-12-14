const { Router } = require('express');
const { signup,login,updateUser,findUser,isAuthenticated,getUserDetails } = require('../controller/user');
const {jwtValidate} = require('../middleware');
const app = Router();
app.post('/signin', login);

app.post("/signup", signup);

app.put("/update", jwtValidate, updateUser);

app.get("/bulk",jwtValidate, findUser);

app.get("/me", jwtValidate, isAuthenticated);

app.get("/profile", jwtValidate, getUserDetails);
module.exports = app;