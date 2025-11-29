// src/oracle.js
const crypto = require("crypto");

let roundCounter = 1;

function getOracleQuote() {
  const asset = "ADA";
  const basePrice = 1.5;
  const jitter = (Math.random() - 0.5) * 0.05; // ± 5% random for demo
  const price = parseFloat((basePrice * (1 + jitter)).toFixed(4));
  const timestamp = Math.floor(Date.now() / 1000);

  const message = `${asset}:${price}:${timestamp}`;
  const signature = crypto.createHash("sha256").update(message).digest("hex"); // mock sig

  const round = roundCounter++;
  return { asset, price, timestamp, round, signature };
}

module.exports = { getOracleQuote };
