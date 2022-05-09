import { useEffect } from "react";
import { useWeb3 } from "@components/Hooks";
import { capitalizeString } from "utils";
import { ethers } from "ethers";

const Header = () => {
  const {
    metamaskDetected,
    signerAddress,
    signerBalance,
    provider,
    networkDetails,
    connect,
    setSignerBalance,
  } = useWeb3();
  console.log("##header", provider);
  useEffect(() => {
    window.ethereum?.on("accountsChanged", (accounts) =>
      console.log("accountsChanged", accounts)
    );
    window.ethereum?.on("chainChanged", (chainId) =>
      console.log("chainChanged", chainId)
    );
  }, []);

  const getMyBalance = async () => {
    const signer = await provider.getSigner();
    const balance = await signer.getBalance();
    setSignerBalance(ethers.utils.formatEther(balance));
  };
  return (
    <div className="px-[2rem] py-[1rem] bg-slate-200">
      <div className="grid grid-cols-2 items-center">
        <div className="text-lg">
          {networkDetails.name ? (
            <p>
              Network:{" "}
              <span className="font-bold">
                {capitalizeString(networkDetails?.name)}
              </span>
            </p>
          ) : null}
        </div>
        <div className="justify-self-end">
          {signerAddress ? (
            <div className="flex flex-col items-end">
              <p className="text-lg mb-4">
                Account: <span className="font-bold">{signerAddress}</span>
              </p>
              {signerBalance ? (
                <p className="text-lg">
                  Balance: <span className="font-bold">{signerBalance} ETH</span>
                </p>
              ) : (
                <button
                  onClick={getMyBalance}
                  className="w-48 bg-indigo-500 rounded-md text-center text-white px-2 py-[0.25rem]"
                >
                  Get My Balance
                </button>
              )}
            </div>
          ) : metamaskDetected === true ? (
            <button
              onClick={connect}
              className="w-48 bg-indigo-500 rounded-md text-center text-white ml-4 px-2 py-[1rem]"
            >
              Connect with Metamask
            </button>
          ) : metamaskDetected === false ? (
            "Please Install Metamask"
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Header;
