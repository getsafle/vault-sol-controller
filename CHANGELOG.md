### 1.0.0 (2024-7-22)

##### Solana Keyring Implementation

- Implemented Keyring functionality to enable account generation and export keys
- Added getAccounts() method to fetch list of generated accounts
- Added importWallet() to import account using privateKey
- Added initial test
- Added functionality to sign message
- Added get balance method to fetch SOL balance of an account
- Added functionality to sign SOL and fungible tokens transfer transaction
- Added functionality to broadcast a signed transaction
- Added functionality to get estimated fee for a transaction
- Added functionality to accept priority fee for a transaction
- Added test cases
- Added readme

### 1.0.1 (2024-7-25)

- Updated entry point in json package

### 1.0.2 (2025-05-05)

- Updating solana transaction function for lefi swap which supports different type of solana transaction
