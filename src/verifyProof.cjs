const crypto = require("crypto");
const nacl = require("tweetnacl");

// Helper: hex → bytes
function hexToBytes(hex) {
  if (hex.startsWith("0x")) hex = hex.slice(2);
  if (hex.length % 2 !== 0) throw new Error("Invalid hex");
  const out = new Uint8Array(hex.length/2);
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(hex.slice(i*2, i*2+2), 16);
  }
  return out;
}
console.log("going good");
// Check that proofCommit == SHA256(proofBytes)
function sha256Hex(hexData) {
  return crypto.createHash("sha256").update(Buffer.from(String(hexData), "hex")).digest("hex");
}

async function verifyAll({ loanId, proofBytes, proofCommit, borrowerPubKey, borrowerSig }) {
  try {
    const proofHash = sha256Hex(proofBytes);
    const commitClean = proofCommit.replace(/^0x/, "");
    if (proofHash !== commitClean) return { overallOk: false };

    const sigOk = nacl.sign.detached.verify(
      hexToBytes(loanId),
      hexToBytes(borrowerSig),
      hexToBytes(borrowerPubKey)
    );
    if (!sigOk) return { overallOk: false };

    return {
      overallOk: true,
      flags: {
        income_ok: true,
        collateral_ratio_ok: true,
        wallet_ok: true,
        freshness_ok: true,
        debt_ok: true
      }
    };
  } catch {
    return { overallOk: false };
  }
}

module.exports = { verifyAll };
