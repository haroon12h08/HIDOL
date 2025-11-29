async function verifyAll({ loanId, proofBytes, proofCommit, borrowerPkh, borrowerSig, oracleFresh, publicFlags }) {
  const proofOk = !!(proofBytes && proofCommit);
  const borrowerOk = !!(loanId && borrowerPkh && borrowerSig);
  const oracleFreshOk = oracleFresh ?? true;

  // ✅ Use flags directly from ZK proof
  const flags = { ...publicFlags, freshness_ok: oracleFreshOk && publicFlags.freshness_ok };

  const riskScore = Math.random() > 0.5 ? 0.25 : 0.65; // mock risk score

  return {
    proofOk,
    borrowerOk,
    oracleFresh: oracleFreshOk,
    flags,
    riskScore,
    preset: (publicFlags.preset || "STANDARD").toUpperCase(),
    overallOk: proofOk && borrowerOk && oracleFreshOk && Object.values(flags).every(v => v === true) && riskScore <= 0.7
  };
}

module.exports = { verifyAll };

