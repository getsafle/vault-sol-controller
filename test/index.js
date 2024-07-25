var assert = require('assert');
const { KeyringController: Solana, getBalance } = require('../src/index')

const {
    HD_WALLET_12_MNEMONIC,
    SOLANA_NETWORK: {
        MAINNET,
        DEVNET,
        TESTNET
    },
} = require('./constants.js')
const opts = {
    mnemonic: HD_WALLET_12_MNEMONIC,
    network: DEVNET.NETWORK
}

describe('Controller test', () => {
    const solWallet = new Solana(opts)

    it("Should generate new address ", async () => {
        const wallet = await solWallet.addAccount()
        console.log("wallet, ", wallet)
        const wallet2 = await solWallet.addAccount()
        console.log("wallet2, ", wallet2)
    })

})