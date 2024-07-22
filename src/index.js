const ObservableStore = require("obs-store");
const bs58 = require("bs58");
const helper = require("./helper");
const nacl = require('tweetnacl');


const { solana: { HD_PATH }, solana_connection: { MAINNET }} = require('./config')

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
    const { mnemonic, address } = this.store.getState()
    const idx = address.indexOf(_address);

    if (idx < 0)
      throw "Invalid address, the address is not available in the wallet"
    
    const accountDetails = helper.setupAccount(mnemonic, helper.getHDPath(idx))
    const msg = Buffer.from(message)
    
    return { signedMessage: bs58.encode(nacl.sign.detached(msg, accountDetails.secretKey)) };
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


module.exports = { KeyringController };
