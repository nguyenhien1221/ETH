import React from "react";
import "../ChooseWalletModal/ChooseWalletModal.css";
import { Modal, Card, Space, Button } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { walletsEnum } from "../../features/constants";

const ChooseWalletModal = ({ isModalOpen, handleCancel, handleConnect }) => {
  const walletItems = [
    {
      id: walletsEnum.metaMask,
      title: "MetaMask",
      logo: "https://sepolia.etherscan.io/images/svg/brands/metamask.svg",
    },
    {
      id: walletsEnum.walletConnect,
      title: "WalletConnect",
      logo: "https://sepolia.etherscan.io/images/svg/brands/walletconnect.svg",
    },
    {
      id: walletsEnum.coinbaseWallet,
      title: "Coinbase Wallet",
      logo: "https://sepolia.etherscan.io/images/svg/brands/coinbase.svg",
    },
  ];

  const handleChooseWallet = item => {
    handleConnect(item);
  };

  return (
    <div>
      <Modal
        title="Connect a wallet"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <Card>
          <Space align="start">
            <InfoCircleOutlined />
            <p>
              Connecting wallet for read function is optional, useful if you
              want to call certain functions or simply use your wallet's node.
            </p>
          </Space>
        </Card>
        {walletItems.map(item => (
          <Button
            className="wallet_item"
            onClick={() => handleChooseWallet(item.id)}
          >
            <b>{item.title}</b>
            <span>
              <img src={item.logo} width={25} alt="logo"></img>
            </span>
          </Button>
        ))}
      </Modal>
    </div>
  );
};

export default ChooseWalletModal;
