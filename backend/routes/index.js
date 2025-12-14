const { Router } = require("express");
const userRouter = require("./user");
const adminRouter = require("./admin");
const accountRouter = require("./account");
const app = new Router();

app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/account",accountRouter);
module.exports = app;