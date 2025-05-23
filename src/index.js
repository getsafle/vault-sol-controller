const bs58 = require("bs58");
const nacl = require("tweetnacl");
const helper = require("./helper");
const ObservableStore = require("obs-store");
const solanaWeb3 = require("@solana/web3.js");

const {
  solana: { HD_PATH },
  solana_connection: { MAINNET },
} = require("./config");

class KeyringController {
  constructor(opts) {
    this.store = new ObservableStore({
      mnemonic: opts.mnemonic,
      hdPath: HD_PATH,
      network: helper.getNetwork(opts.network),
      networkType: opts.network ? opts.network : MAINNET.NETWORK,
      wallet: null,
      address: [],
    });
    this.importedWallets = [];
  }

  async addAccount() {
    const { mnemonic, address } = this.store.getState();
    const keyPair = helper.setupAccount(
      mnemonic,
      helper.getHDPath(address.length)
    );
    const _address = keyPair.publicKey.toBase58();
    this.persistAllAddress(_address);
    return { address: _address };
  }

  async getAccounts() {
    const { address } = this.store.getState();
    return address;
  }

  async exportPrivateKey(_address) {
    const { mnemonic, address } = this.store.getState();

    const idx = address.indexOf(_address);
    if (idx < 0)
      throw "Invalid address, the address is not available in the wallet";

    const accountDetails = helper.setupAccount(mnemonic, helper.getHDPath(idx));
    return { privateKey: bs58.encode(accountDetails.secretKey) };
  }

  async importWallet(_privateKey) {
    try {
      const address = helper.importAccount(_privateKey);
      this.importedWallets.push(address.publicKey.toString());
      return address.publicKey.toString();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async signMessage(message, _address) {
    const { mnemonic, address } = this.store.getState();
    const idx = address.indexOf(_address);

    if (idx < 0)
      throw "Invalid address, the address is not available in the wallet";

    const accountDetails = helper.setupAccount(mnemonic, helper.getHDPath(idx));
    const msg = Buffer.from(message);

    return {
      signedMessage: bs58.encode(
        nacl.sign.detached(msg, accountDetails.secretKey)
      ),
    };
  }

  async signTransaction(transaction) {
    const { mnemonic, address, network } = this.store.getState();

    const { from } = transaction;
    const idx = address.indexOf(from);
    if (idx < 0)
      throw "Invalid address, the address is not available in the wallet";

    try {
      const signer = helper.setupAccount(mnemonic, helper.getHDPath(idx));
      const connection = new solanaWeb3.Connection(network, "confirmed");

      // 🔄 Generate the transaction object (legacy or versioned)
      const rawTx = await helper.generateTransactionObject(
        transaction,
        signer,
        connection
      );

      // 🔁 Return serialized transaction in hex
      if (transaction.serializedTx) {
        // 🔐 Sign if it's not already signed
        if (
          rawTx.signatures &&
          rawTx.signatures.some((sig) => sig === undefined || sig.length === 0)
        ) {
          rawTx.sign([signer]);
        }
        const signedTxn = Buffer.from(rawTx.serialize()).toString("hex");
        return { signedTransaction: signedTxn };
      } else {
        const rawSignedTxn = await helper.signTransaction(
          rawTx,
          signer,
          connection,
          []
        );

        const signedTxn = rawSignedTxn.serialize().toString("hex");
        return { signedTransaction: signedTxn };
      }
    } catch (err) {
      throw err;
    }
  }

  async sendTransaction(rawTransaction) {
    try {
      const { network } = this.store.getState();
      const stringBuff = Buffer.from(rawTransaction, "hex");

      const connection = new solanaWeb3.Connection(network, "confirmed");
      const transactionDetails = await connection.sendRawTransaction(
        stringBuff
      );
      return { transactionDetails: transactionDetails };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async getFees(rawTransaction) {
    const { mnemonic, address, network } = this.store.getState();

    const { from } = rawTransaction;
    const idx = address.indexOf(from);
    if (idx < 0)
      throw "Invalid address, the address is not available in the wallet";

    const signer = helper.setupAccount(mnemonic, helper.getHDPath(idx));

    const connection = new solanaWeb3.Connection(network, "confirmed");

    const rawTx = await helper.generateTransactionObject(
      rawTransaction,
      signer,
      connection
    );

    const rawSignedTxn = await helper.signTransaction(
      rawTx,
      signer,
      connection,
      []
    );

    const fees = await connection.getFeeForMessage(
      rawSignedTxn.compileMessage()
    );

    return { fees: fees.value };
  }

  persistAllAddress(_address) {
    const { address } = this.store.getState();
    let newAdd = address;
    newAdd.push(_address);
    this.store.updateState({ address: newAdd });
    return true;
  }

  updatePersistentStore(obj) {
    this.store.updateState(obj);
    return true;
  }
}

const getBalance = async (address, network) => {
  try {
    const _network = helper.getNetwork(network);
    const connection = new solanaWeb3.Connection(_network, "confirmed");
    const accInfo = await connection.getAccountInfo(
      new solanaWeb3.PublicKey(address),
      "confirmed"
    );
    return { balance: accInfo ? accInfo.lamports : 0 };
  } catch (err) {
    throw err;
  }
};

module.exports = { KeyringController, getBalance };
