async function sign(transaction, signer, connection, otherSigners) {

    transaction.recentBlockhash = (
        await connection.getRecentBlockhash('max')
    ).blockhash;

    transaction.feePayer = signer.publicKey;

    transaction.sign(signer)
    if (otherSigners.length > 0) {
        transaction.partialSign(...otherSigners);
    }

    return transaction;
}

module.exports = sign