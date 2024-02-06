"use client";
import React from "react";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";

import { CascadiaLogo } from "@/assets/cascadia-logo";
import { EthereumLogo } from "@/assets/ethereum-logo";

type WagmiProviderType = {
  children: React.ReactNode;
};

const cascadia = {
  id: 11029,
  name: "Cascadia",
  network: "cascadia",
  iconUrl: <CascadiaLogo />,
  iconBackground: "transparent",
  nativeCurrency: {
    decimals: 18,
    name: "cascadia",
    symbol: "tCC",
  },
  rpcUrls: {
    default: {
      http: ["https://testnet.cascadia.foundation"],
    },
    public: {
      http: ["https://testnet.cascadia.foundation"],
    },
  },
  blockExplorers: {
    default: {
      name: "Cascadia Explorer",
      url: "https://explorer.cascadia.foundation/",
    },
  },
  testnet: true,
};

const mainnet = {
  id: 1,
  name: "Ethereum",
  network: "homestead",
  iconUrl: <EthereumLogo />,
  iconBackground: "transparent",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: {
    alchemy: {
      http: ["https://eth-mainnet.g.alchemy.com/v2"],
      webSocket: ["wss://eth-mainnet.g.alchemy.com/v2"],
    },
    infura: {
      http: ["https://mainnet.infura.io/v3"],
      webSocket: ["wss://mainnet.infura.io/ws/v3"],
    },
    default: {
      http: ["https://cloudflare-eth.com"],
    },
    public: {
      http: ["https://cloudflare-eth.com"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "Etherscan",
      url: "https://etherscan.io",
    },
    default: {
      name: "Etherscan",
      url: "https://etherscan.io",
    },
  },
};

export const { chains, publicClient } = configureChains(
  [cascadia, mainnet],
  [publicProvider()],
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
    }),
  ],
  publicClient,
});

const WagmiProvider = ({ children }: WagmiProviderType) => {
  return (
    <>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
    </>
  );
};

export default WagmiProvider;
