const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const ip = require("ip");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());


// Load signer keys ✅
const verifierPublicKey = fs.readFileSync(
  path.join(__dirname, "..", "keys", "verifier.pub"),
  "utf8"
);
const verifierPriv = fs.readFileSync(
  path.join(__dirname, "..", "keys", "verifier.priv"),
  "utf8"
);

// Convert to KeyObject so crypto.sign works ✅
const verifierPrivateKey = crypto.createPrivateKey({
  key: verifierPriv,
  format: "pem",
  type: "pkcs8"
});

// Middlewares ✅
app.use(cors());
app.use(express.json());

// Verification Route ✅
app.post("/verify", async (req, res) => {
  const { loanId, proofBytes, proofCommit, borrowerPkh, borrowerSig, publicFlags } = req.body || {};

  if (!loanId || !proofBytes || !proofCommit || !publicFlags) {
    return res.status(400).json({ error: "missing_proof_payload" });
  }

  // ✅ Hackathon mode proof validation (TEMP accept all)
  const proofHash = crypto.createHash("sha256")
    .update(Buffer.from(proofBytes.replace(/^0x/, ""), "hex"))
    .digest("hex");

  const commitClean = proofCommit.replace(/^0x/, "");
  const commitOk = proofHash === commitClean;

  if (!commitOk) {
    return res.status(400).json({ error: "proof_commit_mismatch" });
  }

  // ✅ Build signed attestation and return
  const now = Math.floor(Date.now()/1000);

  const attestation = {
    loanId,
    proofCommit: commitClean,
    flags: publicFlags,
    oracleRound: 1,
    oracleTimestamp: now,
    expiry: now + 600,
    nonce: crypto.randomBytes(16).toString("hex")
  };

  const signature = crypto.sign(null, Buffer.from(JSON.stringify(attestation)), verifierPrivateKey).toString("hex");

  // ✅ Optional log store, but inside the verify route so no crash
  fs.writeFileSync(
    path.join(__dirname, "verifyLog.json"),
    JSON.stringify(attestation, null, 2)
  );

  return res.json({ attestation, signature });
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Verifier backend active on http://${ip.address()}:${PORT}`);
});
