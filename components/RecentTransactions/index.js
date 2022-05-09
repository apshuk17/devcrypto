import { useState, useRef, useCallback, useEffect } from "react";
import { useWeb3 } from "@components/Hooks";
import { ethers } from "ethers";
import TransactionCard from "@components/TransactionCard";

const RecentTransactions = ({ contractAbi, contractAddress }) => {
  const [txs, setTxs] = useState([]);
  const { signerAddress, provider } = useWeb3();

  const blockCollection = useRef([]);

  const emitTransfer = useCallback(() => {
    if (contractAddress !== "" && provider) {
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi,
        provider
      );
      contract.on("Transfer", (from, to, amount, event) => {
        const blockExist = blockCollection.current.some(
          (blockNumber) => blockNumber === event.blockNumber
        );
        if (!blockExist) {
          blockCollection.current.push(event.blockNumber);
        }
        if (!blockExist) {
          setTxs((currentTxs) => {
            if (currentTxs.length < 5) {
              return [
                {
                  txHash: event.transactionHash,
                  from,
                  to,
                  amount: String(amount),
                  blockNumber: event.blockNumber,
                },
                ...currentTxs,
              ];
            }
            const [tx1, tx2, tx3, tx4, _] = currentTxs;
            return [
              {
                txHash: event.transactionHash,
                from,
                to,
                amount: String(amount),
                blockNumber: event.blockNumber,
              },
              tx1,
              tx2,
              tx3,
              tx4,
            ];
          });
        }
      });
    }
  }, [contractAbi, provider, contractAddress]);

  useEffect(() => {
    emitTransfer()
  }, [emitTransfer])

  return (
    <div>
      {signerAddress ? (
        <>
          <h2 className="text-center text-2xl font-bold mt-8 mb-4">
            Recent Transactions
          </h2>
          {txs.length
            ? txs.map(({ txHash, from, to, amount, blockNumber }) => (
                <TransactionCard
                  key={blockNumber}
                  txHash={txHash}
                  from={from}
                  to={to}
                  amount={amount}
                />
              ))
            : null}
        </>
      ) : null}
    </div>
  );
};

export default RecentTransactions;
