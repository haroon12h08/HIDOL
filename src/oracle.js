const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Load private key
const privPem = fs.readFileSync(path.join(__dirname, "..", "keys", "verifier.priv"), "utf8");
const privKey = crypto.createPrivateKey(privPem);

// Oracle generator
function getOracleQuote(asset = "ADA") {
  const jitter = (Math.random() - 0.5) * 0.02; // small price wiggle
  const basePrice = 1.50; 
  const now = Math.floor(Date.now()/1000);

  const price = parseFloat((basePrice + jitter).toFixed(4));
  const message = `${asset}:${price}:${now}`;
  const signature = crypto.sign(null, Buffer.from(message), privKey).toString("hex");

  return { asset, price, timestamp: now, signature };
}

module.exports = { getOracleQuote };
