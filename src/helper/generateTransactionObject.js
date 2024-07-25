const solanaWeb3 = require('@solana/web3.js');
const { getOrCreateAssociatedTokenAccount, createTransferInstruction} = require("@solana/spl-token");

const { solana_transaction: { NATIVE_TRANSFER, TOKEN_TRANSFER }} = require("../config");

async function generateTransactionObject(transaction, signer, connection) {
  const { txnType } = transaction;
  let rawTransaction = {};

  if (txnType === NATIVE_TRANSFER) {
    const { to, amount } = transaction;
    const receiverPublicKey = new solanaWeb3.PublicKey(to);
    rawTransaction = new solanaWeb3.Transaction().add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: signer.publicKey,
        toPubkey: receiverPublicKey,
        lamports: amount,
      })
    );
  }

  if (txnType === TOKEN_TRANSFER) {
    const { to, amount, token } = transaction;
    const receiverPublicKey = new solanaWeb3.PublicKey(to);
    const tokenPublicKey = new solanaWeb3.PublicKey(token);

    let sourceAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      signer,
      tokenPublicKey,
      signer.publicKey
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      signer,
      tokenPublicKey,
      receiverPublicKey
    );

    rawTransaction = new solanaWeb3.Transaction().add(
      createTransferInstruction(
        sourceAccount.address,
        toTokenAccount.address,
        signer.publicKey,
        amount
      )
    );
  }

  return rawTransaction;
}

module.exports = generateTransactionObject;
