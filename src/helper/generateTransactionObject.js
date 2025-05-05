const solanaWeb3 = require("@solana/web3.js");
const {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
} = require("@solana/spl-token");

const {
  solana_transaction: { NATIVE_TRANSFER, TOKEN_TRANSFER },
} = require("../config");

async function generateTransactionObject(transaction, signer, connection) {
  // ✅ Handle base64 versioned transaction (bypasses normal logic)
  if (transaction.serializedTx) {
    const rawBuffer = Buffer.from(transaction.serializedTx, "base64");
    const versionedTx = solanaWeb3.VersionedTransaction.deserialize(rawBuffer);

    // ✅ Sign the deserialized versioned transaction
    versionedTx.sign([signer]);

    return versionedTx;
  }

  // 🔁 Legacy transaction types
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

  // ⏫ Optional: Add priority fee if needed
  if (transaction?.priorityFee && transaction?.priorityFee > 0) {
    const addPriorityFee = solanaWeb3.ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: transaction.priorityFee,
    });
    rawTransaction.add(addPriorityFee);
  }

  return rawTransaction;
}
module.exports = generateTransactionObject;
