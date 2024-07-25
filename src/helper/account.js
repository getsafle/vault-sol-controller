const bip39 = require("bip39");
const { Keypair } = require("@solana/web3.js");
const { derivePath } = require("ed25519-hd-key");

function manageSeedandGetAccountDetails(mnemonic, hdPath) {
  const seed = bip39.mnemonicToSeedSync(mnemonic, ""); // (mnemonic, password)
  const keypair = Keypair.fromSeed(derivePath(hdPath, seed.toString("hex")).key);
  return keypair;
}

module.exports = manageSeedandGetAccountDetails;
