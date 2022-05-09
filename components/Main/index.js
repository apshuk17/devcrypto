import React, { useState } from "react";
import { ethers } from "ethers";
import RecentTransactions from "@components/RecentTransactions";
import { useWeb3 } from "@components/Hooks";

const Main = ({ tokenDetails, setTokenDetails, contractAbi }) => {
  const [contractAddress, setContractAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenLoading, setIsTokenLoading] = useState(false);
  const [receipientAddress, setReceipientAddress] = useState("");
  const [amountTransfer, setAmountTransfer] = useState("");
  const [tokenBalance, setTokenBalance] = useState(null);
  const [transferInProgress, setTransferInProgress] = useState(false);
  const { signerAddress, provider } = useWeb3();

  const onContractChange = (event) => {
    setContractAddress(event.target.value);
  };

  const getContractDetails = async (event) => {
    event.preventDefault();
    try {
      if (provider) {
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          provider
        );
        setIsLoading(true);
        const tokenName = await contract.name();
        const tokenSymbol = await contract.symbol();
        const totalSupply = await contract.totalSupply();
        setIsLoading(false);

        setTokenDetails({
          tokenName,
          tokenSymbol,
          totalSupply: ethers.utils.formatUnits(totalSupply),
        });
      }
    } catch (err) {
      console.log("##Token Details Err", err);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (provider) {
      try {
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          signer
        );
        setTransferInProgress(true);
        const { hash } = await contract.transfer(
          receipientAddress,
          amountTransfer
        );
        const waitRes = await provider.waitForTransaction(hash);
        setTransferInProgress(false);
        console.log("##transaction", waitRes);
        setReceipientAddress("");
        setAmountTransfer("");
      } catch (error) {
        console.error("##err Transfer", error);
      }
    }
  };

  const getTokenBalance = async () => {
    if (provider) {
      try {
        const contract = new ethers.Contract(
          contractAddress,
          contractAbi,
          provider
        );
        setIsTokenLoading(true);
        const token = await contract.balanceOf(signerAddress);
        console.log("##Token Balance", ethers.utils.formatUnits(token));
        setIsTokenLoading(false);
        setTokenBalance(ethers.utils.formatUnits(token));
      } catch (err) {
        console.log("##Token Balance Error", err);
      }
    }
  };

  return (
    <div className="grid">
      <div className="grid grid-cols-2">
        <div className="w-4/5 mx-auto">
          <h2 className="text-center text-2xl font-bold my-4">
            Get Contract Details
          </h2>
          <form onSubmit={getContractDetails} className="w-full mt-12">
            <div className="mb-6">
              <label className="block mb-4" htmlFor="token-contract-address">
                Enter Contract Address
              </label>
              <input
                className="w-full bg-slate-100 h-10 rounded-md px-4"
                onChange={onContractChange}
                id="token-contract-address"
                value={contractAddress}
              />
            </div>
            <button
              className="bg-indigo-500 rounded-md text-center text-white w-full py-4 text-lg disabled:opacity-50"
              type="submit"
              disabled={!contractAddress}
            >
              Get Token Details
            </button>
          </form>
          <div className="mt-12 h-[5rem]">
            {tokenDetails.tokenName ? (
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <strong className="mb-2 block">Token Name:</strong>{" "}
                  {tokenDetails.tokenName}
                </div>
                <div className="justify-self-center">
                  <strong className="mb-2 block">Token Symbol:</strong>{" "}
                  {tokenDetails.tokenSymbol}
                </div>
                <div className="justify-self-end">
                  <strong className="mb-2 block">Total Supply:</strong>{" "}
                  {tokenDetails.totalSupply}
                </div>
              </div>
            ) : (
              isLoading && (
                <p className="text-center text-lg font-bold">Loading...</p>
              )
            )}
          </div>
          <div className="mt-12">
            <button
              onClick={getTokenBalance}
              className="bg-indigo-500 rounded-md text-center text-white w-full py-4 text-lg disabled:opacity-50"
              disabled={!contractAddress}
            >
              Get Token Balance
            </button>
          </div>
          <div className="mt-12 h-[2rem]">
            {tokenBalance ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong className="mb-2 block">Address:</strong>{" "}
                  {signerAddress}
                </div>
                <div className="justify-self-end">
                  <strong className="mb-2 block">Total Tokens</strong>{" "}
                  {tokenBalance}
                </div>
              </div>
            ) : (
              isTokenLoading && (
                <p className="text-center text-lg font-bold">Loading...</p>
              )
            )}
          </div>
        </div>
        <div className="w-4/5 mx-auto">
          {signerAddress ? (
            <>
              <h2 className="text-center text-2xl font-bold my-4">
                Transfer Tokens
              </h2>
              <form onSubmit={handleTransfer} className="w-full mt-12">
                <div className="mb-6">
                  <label className="block mb-4" htmlFor="receipient-address">
                    Enter Receipient Address
                  </label>
                  <input
                    className="w-full bg-slate-100 h-10 rounded-md px-4"
                    onChange={(e) => setReceipientAddress(e.target.value)}
                    id="receipient-address"
                    value={receipientAddress}
                  />
                </div>
                <div className="mb-6">
                  <label className="block mb-4" htmlFor="amount-transfer">
                    Amount to transfer
                  </label>
                  <input
                    className="w-full bg-slate-100 h-10 rounded-md px-4"
                    onChange={(e) => setAmountTransfer(e.target.value)}
                    id="amount-transfer"
                    value={amountTransfer}
                  />
                </div>
                <button
                  className="bg-indigo-500 rounded-md text-center text-white w-full py-4 text-lg disabled:opacity-50"
                  type="submit"
                  disabled={
                    !contractAddress ||
                    !amountTransfer ||
                    !receipientAddress ||
                    transferInProgress
                  }
                >
                  Transfer
                </button>
              </form>
              <div>
                {transferInProgress ? (
                  <p className="text-center text-lg font-bold">
                    Transfer in progress...
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
          <RecentTransactions
            contractAbi={contractAbi}
            contractAddress={contractAddress}
          />
        </div>
      </div>
    </div>
  );
};

export default Main;
