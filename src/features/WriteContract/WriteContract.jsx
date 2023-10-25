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
import { TOKEN_CONTRACT } from "../constants";
import abi from "../../abi/abi.json";
import {
  useAccount,
  useConnect,
  useContractWrite,
  useSwitchNetwork,
} from "wagmi";
import { walletClient } from "../../utils/config";

const WriteContract = () => {
  const { address } = useAccount();
  const { chains } = useSwitchNetwork();
  const { connect, connectors } = useConnect();
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
  const [contractHash, setContractHash] = useState({
    approveHash: "",
    decreaseAllowanceHash: "",
    increaseAllowanceHash: "",
    mintHash: "",
    transferHash: "",
    transferFromHash: "",
  });

  const handleApprove = async data => {
    const { ownerAddress, amount } = data;
    approveContract
      .writeAsync({ args: [ownerAddress, amount] })
      .then(data => setContractHash({ approveHash: data.hash }));
  };

  const handleDecreaseAllowance = async data => {
    const { spenderAddress, subtractedValue } = data;
    decreaseAllowance
      .writeAsync({ args: [spenderAddress, subtractedValue] })
      .then(data => setContractHash({ decreaseAllowanceHash: data.hash }));
  };

  const handleIncreaseAllowance = async data => {
    const { spenderAddress, addedValue } = data;
    increaseAllowance
      .writeAsync({ args: [spenderAddress, addedValue] })
      .then(data => setContractHash({ increaseAllowanceHash: data.hash }));
  };

  const handleMint = async data => {
    const { accountAddress, amount } = data;
    mint
      .writeAsync({ args: [accountAddress, amount] })
      .then(data => setContractHash({ mintHash: data.hash }));
  };

  const handleTransfer = async data => {
    const { recipientAddress, amount } = data;
    transfer
      .writeAsync({ args: [recipientAddress, amount] })
      .then(data => setContractHash({ transferHash: data.hash }));
  };

  const handleTransferFrom = async data => {
    const { senderAddress, recipientAddress, amount } = data;
    transferFrom
      .writeAsync({
        args: [senderAddress, recipientAddress, amount],
      })
      .then(data => setContractHash({ transferFromHash: data.hash }))
      .catch(error => alert(error));
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
      extra: genExtra(),
    },
    {
      key: "2",
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
      extra: genExtra(),
    },
    {
      key: "3",
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
      extra: genExtra(),
    },
    {
      key: "4",
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
      extra: genExtra(),
    },
    {
      key: "5",
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
      extra: genExtra(),
    },
    {
      key: "6",
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
      extra: genExtra(),
    },
  ];

  const handleConnect = async item => {
    const [connector] = connectors;
    const [Sepolia] = chains;

    if (item !== 1) {
      setIsOpenModal(false);
      return;
    }

    await walletClient.switchChain({ id: Sepolia.id });
    connect({ connector });
    setIsOpenModal(false);
    setIsConnected(true);
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
      <Spin spinning={approveContract.isLoading}>
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
