import React, { useState, useEffect } from "react";
import "../WriteContract/WriteContract.css";
import { Button, Space, Collapse, Form, Input, Spin } from "antd";
import {
  ArrowRightOutlined,
  CopyOutlined,
  CloudUploadOutlined,
} from "@ant-design/icons";
import FormBox from "../../components/Form/FormBox";
import ChooseWalletModal from "../../components/ChooseWalletModal/ChooseWalletModal";
import { handleConnectToWeb3 } from "../../utils/helper";
import { BrowserProvider, Contract, Wallet } from "ethers";
import { PRIVATE_KEY, TOKEN_CONTRACT } from "../constants";

const WriteContract = () => {
  const abi = [
    "function approve(address _spender, uint256 _value) public returns (bool success)",
    "function mint(address _spender, uint256 _value) public returns (bool success)",
    "function transfer(address _recipient, uint256 _value) public returns (bool success)",
    "function transferFrom(address _from, address _to, uint256 _value) public returns (bool success)",
    "function allowance(address a, address a) view returns (uint)",
  ];
  // const provider = new BrowserProvider(window.ethereum);
  // const signer = new Wallet(PRIVATE_KEY, provider);
  // const contract = new Contract(TOKEN_CONTRACT, abi, signer);

  const [isLoading, setIsLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [contractHash, setContractHash] = useState({
    approveHash: "",
    decreaseAllowanceHash: "",
    increaseAllowanceHash: "",
    mintHash: "",
    transferHash: "",
    transferFromHash: "",
  });
  const [accountAddress, setAccountAddress] = useState("");

  useEffect(() => {
    const getAccount = async () => {
      const account =
        window.ethereum &&
        (await window.ethereum.request({
          method: "eth_requestAccounts",
        }));
      setAccountAddress(account[0]);
    };
    getAccount();
  }, []);

  // const handleApprove = async data => {
  //   const { ownerAddress, amount } = data;
  //   setIsLoading(true);
  //   try {
  //     const approve = await contract.approve(ownerAddress, amount);
  //     await approve.wait();
  //     setContractHash({ approveHash: approve.hash });
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleDecreaseAllowance = async data => {
  //   const { spenderAddress, subtractedValue } = data;
  //   setIsLoading(true);
  //   contract
  //     .allowance(ownerAddress, spenderAddress)
  //     .then(currentAllowance => {
  //       console.log(
  //         `Current Allowance for ${spenderAddress}: ${currentAllowance.toString()}`
  //       );

  //       const newAllowance = currentAllowance - subtractedValue;
  //       contract
  //         .approve(spenderAddress, newAllowance)
  //         .then(tx => {
  //           console.log("Allowance decreased");
  //           setContractHash({ decreaseAllowanceHash: tx.hash });
  //         })
  //         .catch(approveError => {
  //           console.error("Allowance decrease failed:", approveError);
  //         });
  //     })
  //     .catch(allowanceError => {
  //       console.error("Error getting current allowance:", allowanceError);
  //     })
  //     .finally(() => setIsLoading(false));
  // };

  // const handleIncreaseAllowance = async data => {
  //   const { spenderAddress, addedValue } = data;
  //   setIsLoading(true);
  //   contract
  //     .allowance(ownerAddress, spenderAddress)
  //     .then(currentAllowance => {
  //       console.log(
  //         `Current Allowance for ${spenderAddress}: ${currentAllowance.toString()}`
  //       );

  //       const newAllowance = currentAllowance + addedValue;

  //       contract
  //         .approve(spenderAddress, newAllowance)
  //         .then(tx => {
  //           console.log("Allowance increased");
  //           setContractHash({ increaseAllowanceHash: tx.hash });
  //         })
  //         .catch(approveError => {
  //           console.error("Allowance increase failed:", approveError);
  //         });
  //     })
  //     .catch(allowanceError => {
  //       console.error("Error getting current allowance:", allowanceError);
  //     })
  //     .finally(() => setIsLoading(false));
  // };

  // const handleMint = async data => {
  //   const { accountAddress, amount } = data;
  //   setIsLoading(true);
  //   try {
  //     const mint = await contract.mint(accountAddress, amount);
  //     await mint.wait();
  //     setContractHash({ mintHash: mint.hash });
  //   } catch (err) {
  //     console.log(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleTransfer = async data => {
  //   const { recipientAddress, amount } = data;
  //   setIsLoading(true);
  //   try {
  //     const transfer = await contract.transfer(recipientAddress, amount, {
  //       gasLimit: 100000,
  //     });
  //     await transfer.wait();
  //     setContractHash({ transferHash: transfer.hash });
  //     transfer.wait();
  //   } catch (err) {
  //     console.error(err);
  //     alert("fail to transfer");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // const handleTransferFrom = async data => {
  //   const { senderAddress, recipientAddress, amount } = data;
  //   setIsLoading(true);
  //   try {
  //     const transferFrom = await contract.transferFrom(
  //       senderAddress,
  //       recipientAddress,
  //       amount,
  //       {
  //         gasLimit: 1000000,
  //       }
  //     );
  //     await transferFrom.wait();
  //     setContractHash({ transferFromHash: transferFrom.hash });
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

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
            // onSubmit={data => handleApprove(data)}
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
            // onSubmit={data => handleDecreaseAllowance(data)}
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
          // onSubmit={data => handleIncreaseAllowance(data)}
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
          // onSubmit={data => handleMint(data)}
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
          // onSubmit={data => handleTransfer(data)}
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
          // onSubmit={data => handleTransferFrom(data)}
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
          <a
            href={`https://sepolia.etherscan.io/address/${accountAddress}`}
            target="blank"
          >
            Connected Web3 [{accountAddress}]
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
      <Spin spinning={isLoading}>
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
