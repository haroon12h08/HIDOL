// hashCheck.js
import crypto from "crypto";

export function sha256Hex(hex) {
  return crypto.createHash("sha256").update(Buffer.from(hex, "hex")).digest("hex");
}

export function checkProofCommit(proofBytes, proofCommit) {
  const cleanCommit = proofCommit.replace(/^0x/, "");
  const computed = sha256Hex(proofBytes);
  const ok = computed === cleanCommit;
  console.log(`🔗 Commit match: ${ok}`);
  return ok;
}

export default checkProofCommit;
