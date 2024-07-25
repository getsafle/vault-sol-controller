const { Keypair } = require("@solana/web3.js");
const bs58 = require("bs58");

function importAccount(privateKey) {
  try {
    return Keypair.fromSecretKey(bs58.decode(privateKey));
  } catch (e) {
    return undefined;
  }
}

module.exports = importAccount;
