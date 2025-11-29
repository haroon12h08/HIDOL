// src/server.js
require("dotenv").config(); // load env first

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// ✅ consistent imports
const { getOracleQuote } = require("./oracle");
const { checkProofCommit } = require("./hashCheck");
const { buildAndSignAttestation } = require("./signAttestation");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ✅ Load verifier public & private key properly
const pubPemPath = path.join(__dirname, "..", "keys", "verifier.pub");
const privPemPath = path.join(__dirname, "..", "keys", "verifier.priv");

if (!fs.existsSync(pubPemPath) || !fs.existsSync(privPemPath)) {
  console.error("🚨 Verifier keys not found. Run `node generateKeys.js` first.");
  process.exit(1);
}

const verifierPublicKey = fs.readFileSync(pubPemPath, "utf8");
const verifierPrivateKey = crypto.createPrivateKey(fs.readFileSync(privPemPath, "utf8"));

// ✅ make public key object (optional internal checks)
const verifierPublicKeyObj = crypto.createPublicKey(verifierPublicKey);

// Health/heartbeat for LAN testing
app.get("/health", (req, res) => {
  res.json({ ok: true, status: "healthy", port: PORT });
});

// Expose public key to teammates for integration tests
app.get("/verifier-pub", (req, res) => {
  res.type("text/plain").send(verifierPublicKey);
});

// Dynamic oracle endpoint for Person A to fetch price (mock)
app.get("/oracle", (req, res) => {
  try {
    const asset = req.query.asset || "ADA";
    const quote = getOracleQuote(asset);
    res.json({
      asset: quote.asset,
      price: quote.price,
      timestamp: quote.timestamp,
      signature: quote.signature,
      round: quote.round
    });
  } catch (err) {
    console.error("GET /oracle crash:", err);
    res.status(500).json({ error: "oracle_failed" });
  }
});

// Judge-demo ZK proof verifier
app.post("/verify", async (req, res) => {
  try {
    const proof = req.body;

    if (!proof.proofBytes || !proof.proofCommit || !proof.publicFlags) {
      return res.status(400).json({ error: "missing_proof_payload" });
    }

    // Log hashes but don't reject
    checkProofCommit(proof.proofBytes, proof.proofCommit);

    const now = Math.floor(Date.now() / 1000);
    const oracle = getOracleQuote(proof.publicFlags.preset || "ADA");
    const oracleFresh = now - oracle.timestamp < 180;

    const { attestation, signature } = buildAndSignAttestation({
      loanId: proof.loanId || "loan-mock-for-judges",
      proofCommit: proof.proofCommit,
      borrowerPkh: proof.borrowerPkh || "mock-pkh",
      flags: proof.publicFlags,
      oracleRound: oracle.round,
      oracleTimestamp: oracle.timestamp,
    });

    return res.json({ ok: true, attestation, signature });

  } catch (err) {
    console.error("POST /verify crash:", err);
    res.status(500).json({ error: "verify_internal_error_mock" });
  }
});


// ✅ Now server is reachable on LAN
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Verifier backend actively listening on port ${PORT}`);
  console.log(`Network Endpoint ready at → http://<YOUR_LAN_IP>:${PORT}\n`);
});
