// src/hashCheck.js
const crypto = require("crypto");

function sha256Hex(hex) {
  return crypto.createHash("sha256").update(Buffer.from(hex, "hex")).digest("hex");
}

function checkProofCommit(proofBytes, proofCommit) {
  const hash = sha256Hex(proofBytes);
  const normalizedCommit = proofCommit.replace(/^0x/, "").toLowerCase();

  console.log("\n🔍 [HashCheck]");
  console.log("proofBytes      :", proofBytes);
  console.log("sha256(proof)   :", hash);
  console.log("proofCommit recv:", normalizedCommit);

  const ok = hash === normalizedCommit;
  if (!ok) {
    console.log("⚠️  proofCommit MISMATCH (demo mode: not rejecting)");
  } else {
    console.log("✅ proofCommit matches hash(proofBytes)");
  }
  return ok;
}

module.exports = { checkProofCommit };
