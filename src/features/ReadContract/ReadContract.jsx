import "../ReadContract/ReadContract.css";
import React, { useEffect, useState } from "react";
import { Button, Space, Collapse, Form, Input } from "antd";
import {
  FileTextOutlined,
  ArrowRightOutlined,
  CopyOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import FormBox from "../../components/Form/FormBox";
import ChooseWalletModal from "../../components/ChooseWalletModal/ChooseWalletModal";
import { SEPOLIA_ID, TOKEN_CONTRACT } from "../constants";
import abi from "../../abi/abi.json";
import {
  useAccount,
  useConnect,
  useContractReads,
  useContractRead,
} from "wagmi";
import { walletClient } from "../../utils/config";

const ReadContract = () => {
  const { address } = useAccount();
  const { connectors, connectAsync } = useConnect();

  const ITS_CONTRACT = {
    address: TOKEN_CONTRACT,
    abi: abi,
  };

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [contractInput, setContractInput] = useState({
    addressOwner: "",
    addressSpender: "",
  });
  const [contractDatas, setContractDatas] = useState({
    name: "",
    decimals: "",
    symbol: "",
    totalSupply: "",
  });

  const { data } = useContractReads({
    contracts: [
      {
        ...ITS_CONTRACT,
        functionName: "decimals",
      },
      { ...ITS_CONTRACT, functionName: "name" },
      { ...ITS_CONTRACT, functionName: "symbol" },
      { ...ITS_CONTRACT, functionName: "totalSupply" },
    ],
  });

  useEffect(() => {
    data &&
      setContractDatas({
        decimals: String(data[0].result),
        name: String(data[1].result),
        symbol: String(data[2].result),
        totalSupply: String(data[3].result),
      });
  }, [data]);

  const balanceData = useContractRead({
    ...ITS_CONTRACT,
    functionName: "balanceOf",
    enabled: false,
    args: [contractInput.addressOwner],
  });

  const allowanceData = useContractRead({
    ...ITS_CONTRACT,
    functionName: "allowance",
    enabled: false,
    args: [contractInput.addressOwner, contractInput.addressSpender],
  });

  const handleGetbalance = async address => {
    setContractInput({ addressOwner: address.accountAddress });
  };

  const handleGetAllowance = async address => {
    setContractInput({
      addressOwner: address.ownerAddress,
      addressSpender: address.spenderAddress,
    });
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
            <p>{allowanceData.data && String(allowanceData.data)}</p>
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
            <p>{balanceData.data && String(balanceData.data)}</p>
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
          <p>{contractDatas.decimals}</p>
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
          <span>{contractDatas.name}</span>
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
          <span>{contractDatas.symbol}</span>
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
            {String(contractDatas.totalSupply)}
          </a>
          <span className="variable-type">unit256</span>
        </Space>
      ),
      extra: genExtra(),
    },
  ];

  const handleConnect = item => {
    const [connector] = connectors;
    const CHAIN_ID = window.ethereum.networkVersion;

    if (item !== 1) {
      setIsOpenModal(false);
      return;
    }
    if (CHAIN_ID !== SEPOLIA_ID) {
      walletClient.switchChain({ id: SEPOLIA_ID }).then(() => {
        if (address) {
          setIsOpenModal(false);
          setIsConnected(true);
          return;
        }
        connectAsync({ connector })
          .then(() => {
            setIsOpenModal(false);
            setIsConnected(true);
          })
          .catch(err => alert(err.message));
      });
      return;
    }

    if (address) {
      setIsOpenModal(false);
      setIsConnected(true);
      return;
    }
    connectAsync({ connector })
      .then(() => {
        setIsOpenModal(false);
        setIsConnected(true);
      })
      .catch(err => alert(err.message));
  };

  return (
    <div className="container">
      {isConnected ? (
        <Button
          icon={<div className={isConnected ? "green" : undefined}></div>}
        >
          <a
            href={`https://sepolia.etherscan.io/address/${address}`}
            target="blank"
          >
            Connected Web3 [{address}]
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
