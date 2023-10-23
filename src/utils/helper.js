import { getDefaultProvider, BrowserProvider } from "ethers";

export const handleConnectToWeb3 = async () => {
  if (window.ethereum) {
    try {
      const provider = new BrowserProvider(window.ethereum);
      await provider.getSigner();
    } catch {
      console.log("fail to connect...");
    }
  } else {
    console.log("MetaMask not installed; using read-only defaults");
    getDefaultProvider();
  }
};
