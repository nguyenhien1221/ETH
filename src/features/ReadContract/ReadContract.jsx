import "../ReadContract/ReadContract.css";
import React, { useState, useEffect } from "react";
import { Button, Space, Collapse, Form, Input } from "antd";
import {
  FileTextOutlined,
  ArrowRightOutlined,
  CopyOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import FormBox from "../../components/Form/FormBox";
import ChooseWalletModal from "../../components/ChooseWalletModal/ChooseWalletModal";
import { handleConnectToWeb3 } from "../../utils/helper";
import { BrowserProvider, Contract } from "ethers";
import { TOKEN_CONTRACT } from "../constants";

const ReadContract = () => {
  const abi = [
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function name() view returns (string)",
    "function balanceOf(address a) view returns (uint)",
    "function totalSupply() public view returns (uint256)",
    "function allowance(address a, address a) view returns (uint)",
  ];
  const provider = new BrowserProvider(window.ethereum);
  const contract = new Contract(TOKEN_CONTRACT, abi, provider);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [contractData, setContractData] = useState({
    allowance: "",
    balanceOf: "",
    decimals: "",
    name: "",
    symbol: "",
    totalSupply: "",
  });

  useEffect(() => {
    const getContractData = async () => {
      const decimals = await contract.decimals();
      const name = await contract.name();
      const symbol = await contract.symbol();
      const totalSupply = await contract.totalSupply();
      setContractData({
        ...contractData,
        decimals: String(decimals),
        name,
        symbol,
        totalSupply: String(totalSupply),
      });
    };

    getContractData();
  }, []);

  const handleGetbalance = async address => {
    const balnance = await provider.getBalance(address.accountAddress);
    setContractData({ ...contractData, balanceOf: String(balnance) });
  };

  const handleGetAllowance = async address => {
    const { ownerAddress, spenderAddress } = address;
    try {
      const allowance = await contract.allowance(ownerAddress, spenderAddress);
      setContractData({ ...contractData, allowance: String(allowance) });
    } catch (err) {
      console.error(err);
    }
  };

  const genExtra = () => (
    <Space>
      <CopyOutlined
        onClick={event => {
          event.stopPropagation();
        }}
      />
      <CloudUploadOutlined
        onClick={event => {
          event.stopPropagation();
        }}
      />
    </Space>
  );
  const items = [
    {
      key: "1",
      label: "1. allowance",
      children: (
        <div>
          <FormBox
            submitText="Query"
            onSubmit={address => handleGetAllowance(address)}
          >
            <Form.Item
              label="owner (address)"
              name="ownerAddress"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="spender (address)"
              name="spenderAddress"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </FormBox>
          <Space>
            <span className="variable-type">uint256</span>
            <p>{contractData.allowance}</p>
          </Space>
        </div>
      ),
      extra: genExtra(),
    },
    {
      key: "2",
      label: "2. balanceOf",
      children: (
        <div>
          <FormBox
            submitText="Query"
            onSubmit={address => handleGetbalance(address)}
          >
            <Form.Item
              label="account (address)"
              name="accountAddress"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </FormBox>
          <Space>
            <span className="variable-type">uint256</span>
            <p>{contractData.balanceOf}</p>
          </Space>
        </div>
      ),
      extra: genExtra(),
    },
    {
      key: "3",
      label: "3. decimals",
      children: (
        <Space size={2}>
          <p>{contractData.decimals}</p>
          <span className="variable-type">uint8</span>
        </Space>
      ),
      extra: genExtra(),
    },
    {
      key: "4",
      label: "4. name",
      children: (
        <Space size={2}>
          <span>{contractData.name}</span>{" "}
          <span className="variable-type">string</span>
        </Space>
      ),
      extra: genExtra(),
    },
    {
      key: "5",
      label: "5. symbol",
      children: (
        <Space size={2}>
          <span>{contractData.symbol}</span>
          <span className="variable-type">string</span>
        </Space>
      ),
      extra: genExtra(),
    },
    {
      key: "6",
      label: "6. totalSupply",
      children: (
        <Space size={2}>
          <a
            href="https://sepolia.etherscan.io/unitconverter?wei=11205479000000010000123667"
            target="blank"
          >
            {contractData.totalSupply}
          </a>
          <span className="variable-type">unit256</span>
        </Space>
      ),
      extra: genExtra(),
    },
  ];

  const handleConnect = async item => {
    if (item !== 1) {
      setIsOpenModal(false);
      return;
    }
    handleConnectToWeb3()
      .then(() => {
        setIsOpenModal(false);
        setIsConnected(true);
      })
      .catch(() => {
        console.log("fail to connect...");
      });
  };

  return (
    <div className="container">
      {isConnected ? (
        <Button
          icon={<div className={isConnected ? "green" : undefined}></div>}
        >
          <a href={`https://sepolia.etherscan.io/address/`} target="blank">
            Connected Web3
          </a>
        </Button>
      ) : (
        <Button
          icon={<div className={isConnected ? "green" : undefined}></div>}
          size="small"
          onClick={() => setIsOpenModal(true)}
        >
          Connect to Web3
        </Button>
      )}
      <Space>
        <FileTextOutlined></FileTextOutlined>
        <span style={{ color: "white" }}>Read Contract Information</span>
      </Space>

      <div className="action">
        <Collapse
          destroyInactivePanel
          size="small"
          items={items}
          expandIcon={({ isActive }) => (
            <ArrowRightOutlined rotate={isActive ? 90 : 0} />
          )}
          expandIconPosition="end"
        />
      </div>
      <ChooseWalletModal
        isModalOpen={isOpenModal}
        handleCancel={() => setIsOpenModal(false)}
        handleConnect={item => handleConnect(item)}
      />
    </div>
  );
};

export default ReadContract;
