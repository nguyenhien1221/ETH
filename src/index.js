import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ConfigProvider } from "antd";
import theme from "./styles/theme.json";
import {
  WagmiConfig,
  createConfig,
  configureChains,
  sepolia,
  mainnet,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { infuraProvider } from "wagmi/providers/infura";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";

const { publicClient, webSocketPublicClient, chains } = configureChains(
  [sepolia],
  [
    publicProvider(),
    infuraProvider({ apiKey: process.env.REACT_APP_INFURA_KEY }),
  ]
);

const config = createConfig({
  chains,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new MetaMaskConnector({
      chains: [sepolia, mainnet],
    }),
  ],
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ConfigProvider theme={theme}>
        <App />
      </ConfigProvider>
    </WagmiConfig>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
