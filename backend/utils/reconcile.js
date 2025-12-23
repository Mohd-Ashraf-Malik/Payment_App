const { Account, Ledger } = require("../db");

async function reconcileUser(userId) {
  const ledgerSum = await Ledger.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: "$userId",
        balance: {
          $sum: {
            $cond: [
              { $eq: ["$type", "CREDIT"] },
              "$amount",
              { $multiply: ["$amount", -1] }
            ]
          }
        }
      }
    }
  ]);

  const calculatedBalance = ledgerSum[0]?.balance || 0;

  const account = await Account.findOne({ userId });

  if (!account) return null;

  return {
    userId,
    storedBalance: account.balance,
    calculatedBalance,
    isMismatch: account.balance !== calculatedBalance
  };
}

module.exports = { reconcileUser };
