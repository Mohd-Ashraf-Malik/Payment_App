const { Account } = require("../db");
const { reconcileUser } = require("./reconcile");

async function reconcileAllAccounts() {
  const accounts = await Account.find({});
  const mismatches = [];

  for (const acc of accounts) {
    const result = await reconcileUser(acc.userId);

    if (result?.isMismatch) {
      mismatches.push(result);
    }
  }

  return mismatches;
}

module.exports = { reconcileAllAccounts };
