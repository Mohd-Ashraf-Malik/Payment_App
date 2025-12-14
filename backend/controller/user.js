const {signupSchema,loginSchema,userUpdateSchema} = require("../validation/user");
const {User, Account} = require("../db");
const jwt = require("jsonwebtoken");
const {jwtSecret} = require("../config");

async function signup(req,res){
    const {success} = signupSchema.safeParse(req.body);
    if(!success) {
        res.status(401).json({message: "Email already taken / Incorrect inputs"});
        return
    }
    const user = await User.findOne({username: req.body.username});
    if(user){
        res.status(401).json({message: "Email already taken / Incorrect inputs"});
        return
    }
    const dbuser = await User.create({
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName
    }); 
    await Account.create({
        userId: dbuser._id,
        balance: 1 + Math.random()*10000
    });
    const token = jwt.sign({
        userId: dbuser._id,
    },jwtSecret);
    res.json({
        message: "User created successfully",
        token: token
    });
}

async function login(req,res){
    const {success} = loginSchema.safeParse(req.body);
    if(!success){
        res.status(411).json({message: "Incorrect inputs"});
    }
    const user = await User.findOne({
        username: req.body.username,
        password: req.body.password
    });
    if(user){
        const token = jwt.sign({
            userId: user._id,
        },jwtSecret);
        res.json({
            message: "login successful",
            token: token
        });
        return
    }
    res.status(411).json({message: "Error while logging in"})
}

async function updateUser(req,res){
    const {success} = userUpdateSchema.safeParse(req.body);
    if(!success){
        res.status(411).json({message: "Error while updating information"});
    }
    await User.updateOne({_id: req.userId},req.body)
    res.status(200).json({message: "Updated successfully"})
}

async function findUser(req,res){
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [
            {firstName: {"$regex": filter}},
            {lastName: {"$regex": filter}}
        ]
    });
    res.json({users: users});
}

async function isAuthenticated(req, res){
    res.json({
        "authenticated": true
    });
}

async function getUserDetails(req, res){
    req.userId
    const user = await User.findOne({
        _id: req.userId
    });
    res.json({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
    });
}
module.exports = {
    signup,
    login,
    updateUser,
    findUser,
    isAuthenticated,
    getUserDetails
}