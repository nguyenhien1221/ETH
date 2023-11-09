import React from "react";
import { Col, Input, Row, Button, Typography, Space, Tag, Tabs } from "antd";
import {
  SearchOutlined,
  AlertOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import Link from "antd/es/typography/Link";
import ContractItem from "../components/ContractItem/ContractItem";
import { SEPOLIA_ETHERSCAN_URL, TOKEN_CONTRACT } from "../features/constants";
import "./MainScreen.css";
import { useContractRead } from "wagmi";
import abi from "../abi/abi.json";
import { handleCopyMethod } from "../utils/helper";
import { useLocation } from "react-router-dom";

const MainScreen = () => {
  const { hash } = useLocation();
  const action = hash.split("#")[1];

  const navbarItems = ["Home", "Blockchain", "Token", "NFTs", "Misc"];

  const tabsItem = [
    { id: 1, label: "Transfer", item: <div>Stransfer</div> },
    { id: 2, label: "Holders", item: <div>Holders</div> },
    { id: 3, label: "Contract", item: <ContractItem /> },
  ];

  const { data } = useContractRead({
    address: TOKEN_CONTRACT,
    abi: abi,
    functionName: "totalSupply",
  });

  return (
    <div className="App">
      <Row className="header">
        <Col span={12}>
          <div className="token_name">Sepolia Testnet</div>
        </Col>
        <Col span={12}>
          <div>
            <Row>
              <Col span={20}>
                <Input
                  prefix={<SearchOutlined />}
                  size="default"
                  placeholder="Search by Adress / Txn Hash / Block / Token"
                ></Input>
              </Col>
              <Col className="mode-icon" span={2}>
                <Button>
                  <AlertOutlined />
                </Button>
              </Col>
              <Col className="mode-icon" span={2}>
                <Button>
                  <AlertOutlined />
                </Button>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
      <Row className="navbar">
        <Col span={14}>
          <img
            src="https://sepolia.etherscan.io/assets/svg/logos/logo-etherscan-light.svg?v=0.0.5"
            alt="logo"
            width={150}
          ></img>
        </Col>
        <Col span={10}>
          <div>
            <Row justify="end">
              {navbarItems.map(item => (
                <Col className="navbar_item" span={4}>
                  <Link to="/">{item}</Link>
                </Col>
              ))}
            </Row>
          </div>
        </Col>
      </Row>

      <div className="body">
        <Space className="token_title" align="center">
          <img
            src="https://sepolia.etherscan.io/images/main/empty-token.png"
            alt="logo-token"
            width={32}
          ></img>
          <Typography.Title level={2}>Token</Typography.Title>
          <Typography.Title level={5}>Token ITS</Typography.Title>
          <Typography.Title level={5}>(ITS)</Typography.Title>
        </Space>
        <div className="main-content">
          <Tag className="token-erc">ERC-20</Tag>
          <Row gutter={12}>
            <Col span={8}>
              <div className="main-content-info">
                <Typography.Title level={5} className="title">
                  Overview
                </Typography.Title>
                <Typography.Text className="title-info">
                  MAX TOTAL SUPPLY
                </Typography.Text>
                <Space>
                  <Typography.Text>{data && String(data)}</Typography.Text>
                  <Typography.Text>ITS</Typography.Text>
                  <InfoCircleOutlined />
                </Space>
                <Typography.Text className="title-info">
                  HOLDERS
                </Typography.Text>
                <Typography.Text>4</Typography.Text>
                <Typography.Text className="title-info">
                  TOTAL TRANSFERS
                </Typography.Text>
                <Space>
                  <Typography.Text>11</Typography.Text>
                  <InfoCircleOutlined />
                </Space>
              </div>
            </Col>
            <Col span={8}>
              <div className="main-content-info">
                <Typography.Title level={5} className="title">
                  Market
                </Typography.Title>
                <Space>
                  <Typography.Text className="title-info">
                    FULLY DILUTED MARKET CAP
                  </Typography.Text>
                  <QuestionCircleOutlined />
                </Space>
                <Typography.Text>$0.00</Typography.Text>

                <Typography.Text className="title-info">
                  CIRCULATING SUPPLY MARKET CAP
                </Typography.Text>
                <Typography.Text>-</Typography.Text>
              </div>
            </Col>
            <Col span={8}>
              <div className="main-content-info">
                <Typography.Title level={5} className="title">
                  Other info
                </Typography.Title>
                <Typography.Text className="title-info">
                  TOKEN CONTRACT (WITH 18 DECIMALS)
                </Typography.Text>
                <Space>
                  <FileTextOutlined />
                  <a
                    href={`${SEPOLIA_ETHERSCAN_URL}/${TOKEN_CONTRACT}`}
                    target="blank"
                  >
                    {TOKEN_CONTRACT}
                  </a>
                  <CopyOutlined
                    onClick={() => handleCopyMethod(TOKEN_CONTRACT)}
                  />
                </Space>
              </div>
            </Col>
          </Row>

          <div className="main-content-action">
            <Tabs
              type="card"
              items={tabsItem.map(item => {
                return {
                  label: item.label,
                  key: String(item.id),
                  children: <div style={{ padding: "20px" }}>{item.item}</div>,
                };
              })}
              defaultActiveKey={action && "3"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainScreen;
