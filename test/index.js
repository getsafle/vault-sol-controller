var assert = require('assert');
const { KeyringController: Solana, getBalance } = require('../src/index')

const {
    HD_WALLET_12_MNEMONIC,
    TEST_ADDRESS_1,
    TEST_ADDRESS_2,
    PRIVATE_KEY_1,
    SOLANA_NETWORK: {
        MAINNET,
        DEVNET,
        TESTNET
    },
    TRANSACTION_TYPE: { 
        NATIVE_TRANSFER,
        TOKEN_TRANSFER
    },
    TRANSFER_SOL: {
        SOL_RECEIVER,
        SOL_AMOUNT
    },
    TESTING_MESSAGE_1,
    TESTING_MESSAGE_2,
    TESTING_MESSAGE_3,
} = require('./constants.js')

const opts = {
    mnemonic: HD_WALLET_12_MNEMONIC,
    network: DEVNET.NETWORK
}

const SOL_TXN_PARAM = {
    to: SOL_RECEIVER,
    amount: SOL_AMOUNT,
    txnType: NATIVE_TRANSFER,
}

describe('Controller test', () => {
    const solWallet = new Solana(opts)

    it("Should generate new address ", async () => {
        const wallet = await solWallet.addAccount()
        assert(wallet.address === TEST_ADDRESS_1, "Added address should be " + TEST_ADDRESS_1)
        console.log("wallet, ", wallet)
        const wallet2 = await solWallet.addAccount()
        console.log("wallet2, ", wallet2)
        assert(wallet2.address === TEST_ADDRESS_2, "Added address should be " + TEST_ADDRESS_2)
    })

    it("Should get accounts", async () => {
        const acc = await solWallet.getAccounts()
        console.log("acc ", acc)
        assert(acc.length === 2, "Should have 2 addresses")
    })

    it("Should get privateKey ", async () => {
        const acc = await solWallet.getAccounts()
        const privateKey = await solWallet.exportPrivateKey(acc[0])
        console.log("privateKey, ", privateKey)
        assert(privateKey.privateKey === PRIVATE_KEY_1, "Private key should be " + PRIVATE_KEY_1)
    })

    it("Should import new account ", async () => {
        const acc = await solWallet.getAccounts()
        const { privateKey } = await solWallet.exportPrivateKey(acc[0])
        const account = await solWallet.importWallet(privateKey)
        console.log("account, ", account)
        assert(account === acc[0], "Should be the zeroth account")
    })

    it("Should get balance of the address ", async () => {
        const acc = await solWallet.getAccounts()
        const balance = await getBalance(acc[0], opts.network)
        console.log("balance ", balance)
        assert(balance.balance > 0, "Balance should be greater than 0")
    })

    it("Should sign SOL transfer transaction ", async () => {
        assert(solWallet.address !== null)
        const acc = await solWallet.getAccounts()
        SOL_TXN_PARAM['from'] = acc[0]

        const wallet = await solWallet.signTransaction(SOL_TXN_PARAM)

        console.log("SOL Transfer signed transaction ", wallet.signedTransaction)
    })

    it("Sign message", async () => {
        const acc = await solWallet.getAccounts()

        const signedMessage1 = await solWallet.signMessage(TESTING_MESSAGE_1, acc[0])
        console.log("Signed message 1: ", signedMessage1)
        assert(signedMessage1.signedMessage, "Message not signed successfully")

        const signedMessage2 = await solWallet.signMessage(TESTING_MESSAGE_2, acc[0])
        console.log("Signed message 2: ", signedMessage2)
        assert(signedMessage2.signedMessage, "Message not signed successfully")

        const signedMessage3 = await solWallet.signMessage(TESTING_MESSAGE_3, acc[0])
        console.log("Signed message 3: ", signedMessage3)
        assert(signedMessage3.signedMessage, "Message not signed successfully")
    })

})