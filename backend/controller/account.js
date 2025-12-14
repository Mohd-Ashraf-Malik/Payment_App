const {balanceTransferSchema} = require("../validation/account");
const {Account,Transaction,mongoose} = require("../db");
// const mongoose = require("mongoose");

async function transferBalance(req,res){
    const {success} = balanceTransferSchema.safeParse(req.body);
    if(!success){
        res.status(411).json({message:"Invalid request"});
        return;
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    const account = await Account.findOne({userId: req.userId}).session(session);
    if(!account || account.balance < req.body.amount){
        await session.abortTransaction();
        res.status(400).json({message:"Insufficient balance"});
        return;
    }
    const toAccount = await Account.findOne({userId: req.body.to}).session(session);
    if(!toAccount){
        await session.abortTransaction();
        res.status(411).json({message:"Invalid account"});
        return;
    } 
    const amount = parseInt(req.body.amount);
    await Account.updateOne({userId:req.userId},{$inc: {balance: -amount}}).session(session);
    await Account.updateOne({userId:req.body.to},{$inc: {balance: amount}}).session(session);
    await Transaction.create([{
        from: req.userId,
        to: req.body.to,
        amount: amount,
        timestamp: Date.now()
    }], {session});
    await session.commitTransaction();
    res.status(200).json({
        message: "Transfer successful"
    });
}

async function getBalance(req,res){
    const account = await Account.findOne({
        userId: req.userId
    });
    if(!account){
        res.status(500).json({message: "internal server error"});
        return
    }
    res.status(200).json({
        balance: account.balance
    });
}

async function getTransactions(req,res){
    const transactions = await Transaction.find({
        $or: [
            {to: req.userId},
            {from: req.userId}
        ]
    })
    res.json({
        transactions: transactions
    })
}

module.exports = {
    transferBalance,
    getBalance,
    getTransactions
}