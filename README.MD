# vault-SOL-controller<code><a href="https://www.docker.com/" target="_blank"><img height="50" src="https://assets.coingecko.com/coins/images/4128/standard/solana.png?1718769756"></a></code>

[![npm version](https://badge.fury.io/js/@getsafle%2Fvault-sol-controller.svg)](https://badge.fury.io/js/@getsafle%2Fvault-sol-controller) <img alt="Static Badge" src="https://img.shields.io/badge/License-MIT-green">   [![Discussions][discussions-badge]][discussions-link]
 <img alt="Static Badge" src="https://img.shields.io/badge/sol_controller-documentation-purple"> 



## Install

`npm install --save @getsafle/vault-sol-controller`

## Initialize the solana Controller class

```
const { KeyringController, getBalance } = require('@getsafle/vault-sol-controller');

const solController = new KeyringController({
    // 12 words mnemonic to create wallet
    mnemonic: string,
    // network - type of network [TESTNET|MAINNET]
    // default is MAINNET even if no network is passed
    network: string (TESTNET | MAINNET)
});
```

## Methods

### add new account

```
const keyringState = await solController.addAccount();
```

### Export the private key of an address present in the keyring

```
const privateKey = await solController.exportPrivateKey(address);
```

### Get all accounts in the keyring

```
const privateKey = await solController.getAccounts();
```

### Sign a transaction

```
const signedTx = await solController.signTransaction(solTx);

STX transfer transaction:
solTx: {from, to, amount, txnType}

Token transfer transaction:
solTx: {from, to, amount, txnType, token}

transactionType = 'NATIVE_TRANSFER' || 'TOKEN_TRANSFER'
```

### Sign a message

```
const signedMsg = await solController.signMessage(msgString, address);
```

### Get fees

```
const fees = await solController.getFees(rawTransaction);
```

### Get balance

```
const balance = await getBalance(address, network); // if network !== TESTNET then it will fetch mainnet balance
```

[discussions-badge]: https://img.shields.io/badge/Code_Quality-passing-rgba
[discussions-link]: https://github.com/getsafle/vault-sol-controller/actions
