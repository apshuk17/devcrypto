import { createContext, useEffect, useState, useCallback } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";

export const Web3Context = createContext(null);

const Web3Provider = ({ children }) => {
  const [metamaskDetected, setMetamaskDetected] = useState("");
  const [provider, setProvider] = useState(null);
  const [signerAddress, setSignerAddress] = useState("");
  const [signerBalance, setSignerBalance] = useState("");
  const [networkDetails, setNetworkDetails] = useState({
    name: "",
    chainId: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const ethProvider = await detectEthereumProvider();
        if (ethProvider) {
          const provider = new ethers.providers.Web3Provider(ethProvider);
          setProvider(provider);
        } else {
          setMetamaskDetected(false);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (provider) {
        const accounts = await provider.send("eth_accounts", []);
        const network = await provider.getNetwork();
        setNetworkDetails({ name: network?.name, chainId: network?.chainId });
        const [account] = accounts;
        if (account) {
          const accountBalance = await provider.getBalance(account);
          setSignerAddress(account);
          setSignerBalance(ethers.utils.formatEther(accountBalance));
        }
        setMetamaskDetected(true);
      }
    })();
  }, [provider]);

  const connect = useCallback(async () => {
    try {
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const signerBalance = await signer.getBalance();
      const signerAddress = await signer.getAddress();
      setSignerAddress(signerAddress);
      setSignerBalance(ethers.utils.formatEther(signerBalance));
    } catch (err) {
      console.error(err);
    }
  }, [provider]);

  return (
    <Web3Context.Provider
      value={{
        metamaskDetected,
        provider,
        signerAddress,
        signerBalance,
        networkDetails,
        connect,
        setSignerBalance
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
