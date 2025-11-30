import crypto from "crypto";
import fs from "fs";
import path from "path";

const privPath = path.join(process.cwd(), "keys", "verifier.priv");
const key = crypto.createPrivateKey(fs.readFileSync(privPath, "utf8"));

export function buildAndSignAttestation({
  loanId,
  proofCommit,
  flags,
  oracleRound,
  oracleTimestamp
}) {

  const attestation = {
    loanId,
    proofCommit,
    flags,
    oracleRound,
    oracleTimestamp,
    expiry: Math.floor(Date.now()/1000) + 600,
    nonce: crypto.randomBytes(32).toString("hex").slice(0, 64)
  };

  const signature = crypto.sign(null, Buffer.from(JSON.stringify(attestation)), key).toString("hex");

  return { attestation, signature };
}

export default buildAndSignAttestation;
