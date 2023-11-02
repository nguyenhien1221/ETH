import { createWalletClient, custom,  } from "viem";
import {  sepolia } from "wagmi";

export const walletClient = createWalletClient({
  chain: sepolia,
  transport: custom(window.ethereum),
});
