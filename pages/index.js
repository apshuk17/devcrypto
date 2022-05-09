import { useState, useEffect, useCallback, useRef } from "react";
import { ethers } from "ethers";
import Header from "@components/Header";
import Main from "@components/Main";
import { useWeb3 } from "@components/Hooks";

export default function Home() {
  const [contractAbi, setContractAbi] = useState(null);
  const [tokenDetails, setTokenDetails] = useState({
    tokenName: "",
    tokenSymbol: "",
    totalSupply: null,
  });
  const [txs, setTxs] = useState([]);

  const { metamaskDetected } = useWeb3();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/contracts/DevCrypto.json");
        const jsonRes = await res.json();
        setContractAbi(jsonRes?.abi);
      } catch (error) {
        console.error("##error", error);
      }
    })();
  }, []);

  // useEffect(() => {
  //   emitTransfer();
  // }, [emitTransfer]);

  return (
    <div>
      {metamaskDetected === true ? (
        <>
          <Header />
          <Main
            tokenDetails={tokenDetails}
            setTokenDetails={setTokenDetails}
            contractAbi={contractAbi}
            txs={txs}
          />
        </>
      ) : (
        <div className="grid place-items-center h-[100vh] text-5xl font-bold">
          {metamaskDetected === false ? (
            <p>Please Install Metamask!</p>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      )}
    </div>
  );
}
