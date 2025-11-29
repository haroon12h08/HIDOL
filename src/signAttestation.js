// src/signAttestation.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const privPem = fs.readFileSync(
  path.join(__dirname, "..", "keys", "verifier.priv"),
  "utf8"
);
const verifierPrivateKey = crypto.createPrivateKey({
  key: privPem,
  format: "pem",
  type: "pkcs8"
});

function buildAttestation({ loanId, proofCommit, flags, oracleRound, oracleTimestamp }) {
  const now = Math.floor(Date.now() / 1000);

  return {
    loanId,
    proofCommit,
    flags,
    oracleRound,
    oracleTimestamp,
    expiry: now + 10 * 60, // 10 minutes
    nonce: crypto.randomBytes(16).toString("hex")
  };
}

function signAttestation(attestation) {
  const payload = JSON.stringify(attestation);
  const sig = crypto.sign(null, Buffer.from(payload), verifierPrivateKey);
  return sig.toString("hex");
}

function buildAndSignAttestation(params) {
  const attestation = buildAttestation(params);
  const signature = signAttestation(attestation);
  return { attestation, signature };
}

module.exports = { buildAndSignAttestation };
