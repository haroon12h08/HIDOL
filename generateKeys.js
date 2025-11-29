/*const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const keysDir = path.join(__dirname, "keys");
if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir);

const privFile = path.join(keysDir, "verifier.priv");
const pubFile = path.join(keysDir, "verifier.pub");

if (fs.existsSync(privFile) && fs.existsSync(pubFile)) {
  console.log("Keys already exist. Keeping them.");
  process.exit(0);
}

const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519", {
  publicKeyEncoding: { format: "pem", type: "spki" },
  privateKeyEncoding: { format: "pem", type: "pkcs8" }
});

fs.writeFileSync(pubFile, publicKey, "utf8");
fs.writeFileSync(privFile, privateKey, "utf8");
console.log("✅ Ed25519 PEM keys generated.");*/

// generateKeys.js
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const keysDir = path.join(__dirname, "keys");
if (!fs.existsSync(keysDir)) fs.mkdirSync(keysDir);

const privFile = path.join(keysDir, "verifier.priv");
const pubFile = path.join(keysDir, "verifier.pub");

if (fs.existsSync(privFile) && fs.existsSync(pubFile)) {
  console.log("🔑 Keys already exist, keeping them.");
  process.exit(0);
}

const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519", {
  publicKeyEncoding: { format: "pem", type: "spki" },
  privateKeyEncoding: { format: "pem", type: "pkcs8" }
});

fs.writeFileSync(pubFile, publicKey, "utf8");
fs.writeFileSync(privFile, privateKey, "utf8");

console.log("✅ Generated verifier.priv / verifier.pub");

