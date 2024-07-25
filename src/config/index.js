
module.exports = {
    solana: {
        HD_PATH: `m/44'/501'/0'/0'`,
    },
    solana_transaction: {
        NATIVE_TRANSFER: "NATIVE_TRANSFER",
        TOKEN_TRANSFER: "TOKEN_TRANSFER",
    },
    solana_connection: {
        MAINNET: {
            NETWORK: "MAINNET",
            URL: 'https://api.mainnet-beta.solana.com',
        },

        TESTNET: {
            NETWORK: "TESTNET",
            URL: 'https://api.testnet.solana.com',
        },
        DEVNET: {
            NETWORK: "DEVNET",
            URL: 'https://api.devnet.solana.com'
        }
    }
}