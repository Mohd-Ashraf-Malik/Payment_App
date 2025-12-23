const { balanceTransferSchema } = require("../validation/account");
const { User, Account, Transaction, Idempotency, mongoose, Ledger } = require("../db");
const { logAudit } = require("../utils/auditLogger.js");
const { isRetryableError } = require("../utils/isRetryableError");

// const mongoose = require("mongoose");

async function transferBalance(req, res) {
  const { success } = balanceTransferSchema.safeParse(req.body);
  if (!success) {
    return res.status(411).json({ message: "Invalid request" });
  }

  const idempotencyKey = req.headers["idempotency-key"];
  if (!idempotencyKey) {
    return res.status(400).json({ message: "Idempotency key required" });
  }

  const existingRequest = await Idempotency.findOne({
    key: idempotencyKey,
    userId: req.userId,
  });

  if (existingRequest) {
    return res.json(existingRequest.response);
  }

  const MAX_RETRIES = 3;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const amount = Number(req.body.amount);

      const fromAccount = await Account.findOne({ userId: req.userId }).session(
        session
      );

      if (!fromAccount || fromAccount.balance < amount) {
        throw new Error("Insufficient balance");
      }

      const toAccount = await Account.findOne({ userId: req.body.to }).session(
        session
      );

      if (!toAccount) {
        throw new Error("Invalid account");
      }

      const fromUser = await User.findById(req.userId).session(session);
      const toUser = await User.findById(req.body.to).session(session);

      if (!fromUser || !toUser) {
        throw new Error("User not found");
      }

      await Account.updateOne(
        { userId: req.userId },
        { $inc: { balance: -amount } }
      ).session(session);

      await Account.updateOne(
        { userId: req.body.to },
        { $inc: { balance: amount } }
      ).session(session);

      const transaction = await Transaction.create(
        [
          {
            from: req.userId,
            to: req.body.to,
            fromName: `${fromUser.firstName} ${fromUser.lastName}`,
            toName: `${toUser.firstName} ${toUser.lastName}`,
            amount,
            timestamp: new Date(),
          },
        ],
        { session }
      );

      await Ledger.create(
        [
          {
            userId: req.userId,
            transactionId: transaction[0]._id,
            type: "DEBIT",
            amount: amount,
            balanceAfter: fromAccount.balance - amount,
          },
          {
            userId: req.body.to,
            transactionId: transaction[0]._id,
            type: "CREDIT",
            amount: amount,
            balanceAfter: toAccount.balance + amount,
          },
        ],
        { session,ordered: true }
      );

      // 🔒 Try to acquire lock
      const tryLock = async function () {
        const lockedAccount = await Account.findOneAndUpdate(
          { userId: req.userId, isLocked: false },
          { isLocked: true, lockTimestamp: new Date() }
        );

        if (!lockedAccount) {
          return false;
        }
        return true;
      };

      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      let done = false;
      for (let i = 0; i < 3; i++) {
        const lock = tryLock();
        if (lock) done = true;
        await sleep(1000);
      }
      if (!done) {
        throw new Error("Could not acquire lock. Please try again.");
      }

      await session.commitTransaction();

      const response = {
        message: "Transfer successful",
        transactionId: transaction[0]._id,
      };

      await Idempotency.create({
        key: idempotencyKey,
        userId: req.userId,
        response,
      });

      return res.json(response);
    } catch (err) {
      await session.abortTransaction();

      if (isRetryableError(err) && attempt < MAX_RETRIES) {
        console.log(`Retrying transaction (attempt ${attempt})`);
        continue; // 🔁 retry
      }

      return res.status(400).json({ message: err.message });
    } finally {
      await Account.updateOne(
        { userId: req.userId },
        { isLocked: false, lockTimestamp: null }
      );
      session.endSession();
    }
  }
}

async function getBalance(req, res) {
  const account = await Account.findOne({
    userId: req.userId,
  });
  if (!account) {
    res.status(500).json({ message: "internal server error" });
    return;
  }
  res.status(200).json({
    balance: account.balance,
  });
}

async function getTransactions(req, res) {
  const transactions = await Transaction.find({
    $or: [{ to: req.userId }, { from: req.userId }],
  });
  res.json({
    transactions: transactions,
  });
}


async function getLedger(req, res) {
  const entries = await Ledger.find({ userId: req.userId })
    .sort({ createdAt: -1 });

  res.json({ entries });
}


module.exports = {
  transferBalance,
  getBalance,
  getTransactions,
  getLedger
};
