import { createWalletClient, custom } from "viem";

export const walletClient = createWalletClient({
  transport: custom(window.ethereum),
});

