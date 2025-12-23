function isRetryableError(err) {
  if (!err) return false;

  // MongoDB transaction retry labels
  if (err.hasErrorLabel?.("TransientTransactionError")) return true;
  if (err.hasErrorLabel?.("UnknownTransactionCommitResult")) return true;

  // Write conflict
  if (err.code === 112) return true;

  return false;
}

module.exports = { isRetryableError };
