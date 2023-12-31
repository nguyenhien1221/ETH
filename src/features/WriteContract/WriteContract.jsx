import React, { useState } from "react";
import "../WriteContract/WriteContract.css";
import { Button, Space, Collapse, Form, Input, Spin } from "antd";
import {
  ArrowRightOutlined,
  CopyOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import FormBox from "../../components/Form/FormBox";
import ChooseWalletModal from "../../components/ChooseWalletModal/ChooseWalletModal";
import {
  TOKEN_CONTRACT,
  SEPOLIA_ID,
  walletsEnum,
  SEPOLIA_ETHERSCAN_URL,
} from "../constants";
import abi from "../../abi/abi.json";
import { useAccount, useConnect, useContractWrite } from "wagmi";
import { walletClient } from "../../utils/config";
import { handleCopyLink, handleCopyMethod } from "../../utils/helper";
import { useLocation } from "react-router-dom";
import { errorNotification } from "../../components/Notification/Notification";

const WriteContract = () => {
  const { address } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const { hash } = useLocation();
  const method = hash.split("#")[2];

  const writeContractConfig = {
    address: TOKEN_CONTRACT,
    abi: abi,
    gas: 1000000,
  };

  const approveContract = useContractWrite({
    ...writeContractConfig,
    functionName: "approve",
  });

  const decreaseAllowance = useContractWrite({
    ...writeContractConfig,
    functionName: "decreaseAllowance",
  });

  const increaseAllowance = useContractWrite({
    ...writeContractConfig,
    functionName: "increaseAllowance",
  });

  const mint = useContractWrite({
    ...writeContractConfig,
    functionName: "mint",
  });

  const transfer = useContractWrite({
    ...writeContractConfig,
    functionName: "transfer",
  });

  const transferFrom = useContractWrite({
    ...writeContractConfig,
    functionName: "transferFrom",
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState(1);
  const [contractHash, setContractHash] = useState({
    approveHash: "",
    decreaseAllowanceHash: "",
    increaseAllowanceHash: "",
    mintHash: "",
    transferHash: "",
    transferFromHash: "",
  });

  const isWritingContract =
    approveContract.isLoading ||
    decreaseAllowance.isLoading ||
    increaseAllowance.isLoading ||
    mint.isLoading ||
    transfer.isLoading ||
    transferFrom.isLoading;

  const handleApprove = async data => {
    const { ownerAddress, amount } = data;
    approveContract
      .writeAsync({ args: [ownerAddress, amount] })
      .then(data => setContractHash({ approveHash: data.hash }))
      .catch(err => errorNotification(err.message));
  };

  const handleDecreaseAllowance = async data => {
    const { spenderAddress, subtractedValue } = data;
    decreaseAllowance
      .writeAsync({ args: [spenderAddress, subtractedValue] })
      .then(data => setContractHash({ decreaseAllowanceHash: data.hash }))
      .catch(err => errorNotification(err.message));
  };

  const handleIncreaseAllowance = async data => {
    const { spenderAddress, addedValue } = data;
    increaseAllowance
      .writeAsync({ args: [spenderAddress, addedValue] })
      .then(data => setContractHash({ increaseAllowanceHash: data.hash }))
      .catch(err => errorNotification(err.message));
  };

  const handleMint = async data => {
    const { accountAddress, amount } = data;
    mint
      .writeAsync({ args: [accountAddress, amount] })
      .then(data => setContractHash({ mintHash: data.hash }))
      .catch(err => errorNotification(err.message));
  };

  const handleTransfer = async data => {
    const { recipientAddress, amount } = data;
    transfer
      .writeAsync({ args: [recipientAddress, amount] })
      .then(data => setContractHash({ transferHash: data.hash }))
      .catch(err => errorNotification(err.message));
  };

  const handleTransferFrom = async data => {
    const { senderAddress, recipientAddress, amount } = data;
    transferFrom
      .writeAsync({
        args: [senderAddress, recipientAddress, amount],
      })
      .then(data => setContractHash({ transferFromHash: data.hash }))
      .catch(err => errorNotification(err.message));
  };

  const genExtra = item => (
    <Space>
      <CopyOutlined
        onClick={event => {
          event.stopPropagation();
          handleCopyMethod(item);
        }}
      />

      <CloudUploadOutlined
        onClick={event => {
          event.stopPropagation();
          handleCopyLink(item, "write");
        }}
      />
    </Space>
  );
  const items = [
    {
      key: "approve",
      label: "1. approve",
      children: (
        <div>
          <FormBox
            contractHash={contractHash.approveHash}
            submitText="Write"
            isDisableSubmitBtn={isConnected}
            onSubmit={data => handleApprove(data)}
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
              label="amount (uint256)"
              name="amount"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </FormBox>
        </div>
      ),
      extra: genExtra("approve"),
    },
    {
      key: "decreaseAllowance",
      label: "2. decreaseAllowance",
      children: (
        <div>
          <FormBox
            contractHash={contractHash.decreaseAllowanceHash}
            submitText="Write"
            isDisableSubmitBtn={isConnected}
            onSubmit={data => handleDecreaseAllowance(data)}
          >
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
            <Form.Item
              label="subtractedValue (uint256)"
              name="subtractedValue"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          </FormBox>
        </div>
      ),
      extra: genExtra("decreaseAllowance"),
    },
    {
      key: "increaseAllowance",
      label: "3. increaseAllowance",
      children: (
        <FormBox
          contractHash={contractHash.increaseAllowanceHash}
          submitText="Write"
          isDisableSubmitBtn={isConnected}
          onSubmit={data => handleIncreaseAllowance(data)}
        >
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
          <Form.Item
            label="addedValue (uint256)"
            name="addedValue"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </FormBox>
      ),
      extra: genExtra("increaseAllowance"),
    },
    {
      key: "mint",
      label: "4. mint",
      children: (
        <FormBox
          submitText="Write"
          isDisableSubmitBtn={isConnected}
          onSubmit={data => handleMint(data)}
          contractHash={contractHash.mintHash}
        >
          <Form.Item
            label="account(address)"
            name="accountAddress"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="amount (uint256)"
            name="amount"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </FormBox>
      ),
      extra: genExtra("mint"),
    },
    {
      key: "transfer",
      label: "5. transfer",
      children: (
        <FormBox
          submitText="Write"
          isDisableSubmitBtn={isConnected}
          onSubmit={data => handleTransfer(data)}
          contractHash={contractHash.transferHash}
        >
          <Form.Item
            label="recipient (address)"
            name="recipientAddress"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="amount (uint256)"
            name="amount"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </FormBox>
      ),
      extra: genExtra("transfer"),
    },
    {
      key: "transferFrom",
      label: "6. transferFrom",
      children: (
        <FormBox
          submitText="Write"
          isDisableSubmitBtn={isConnected}
          onSubmit={data => handleTransferFrom(data)}
          contractHash={contractHash.transferFromHash}
        >
          <Form.Item
            label="sender (address)"
            name="senderAddress"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="recipient (address)"
            name="recipientAddress"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="amount (uint256)"
            name="amount"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </FormBox>
      ),
      extra: genExtra("transferFrom"),
    },
  ];

  const handleConnect = async item => {
    const [metaMask, walletConnect, coinbaseWallet] = connectors;
    let connector;
    const CHAIN_ID = await walletClient.getChainId();

    if (item === walletsEnum.metaMask) {
      connector = metaMask;
      setSelectedConnector(1);
    } else if (item === walletsEnum.walletConnect) {
      connector = walletConnect;
      setSelectedConnector(2);
      setIsOpenModal(false);
    } else {
      connector = coinbaseWallet;
      setSelectedConnector(3);
      setIsOpenModal(false);
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
          .catch(err => {
            errorNotification(err.message);
            setSelectedConnector(1);
          });
      });
      return;
    }

    if (address && item === selectedConnector) {
      setIsOpenModal(false);
      setIsConnected(true);
      return;
    }
    connectAsync({ connector })
      .then(() => {
        setIsOpenModal(false);
        setIsConnected(true);
      })
      .catch(err => {
        errorNotification(err.message);
        setSelectedConnector(1);
      });
  };

  return (
    <div className="container">
      {isConnected ? (
        <Button
          icon={<div className={isConnected ? "green" : undefined}></div>}
        >
          <a href={`${SEPOLIA_ETHERSCAN_URL}/${address}`} target="blank">
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
      <Spin spinning={isWritingContract}>
        <div className="action">
          <Collapse
            destroyInactivePanel
            size="small"
            items={items}
            expandIcon={({ isActive }) => (
              <ArrowRightOutlined rotate={isActive ? 90 : 0} />
            )}
            expandIconPosition="end"
            defaultActiveKey={method}
          />
        </div>
      </Spin>
      <ChooseWalletModal
        isModalOpen={isOpenModal}
        handleCancel={() => setIsOpenModal(false)}
        handleConnect={item => handleConnect(item)}
      />
    </div>
  );
};
export default WriteContract;
