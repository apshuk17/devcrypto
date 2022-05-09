const TransactionCard = ({txHash, from, to, amount}) => {
    return (
        <div className="w-5/6 rounded-md bg-slate-100 mb-4 text-sm mx-auto p-4">
            <p><strong>Tx Hash: </strong><span>{txHash}</span></p>
            <p><strong>From: </strong><span>{from}</span></p>
            <p><strong>To: </strong><span>{to}</span></p>
            <p><strong>Amount: </strong><span>{amount}</span></p>
        </div>
    );
}

export default TransactionCard;