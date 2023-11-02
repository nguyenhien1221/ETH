import React from "react";
import { Tabs } from "antd";
import "../ContractItem/ContractItem.css";
import ReadContract from "../../features/ReadContract/ReadContract";
import WriteContract from "../../features/WriteContract/WriteContract";
import { useParams } from "react-router-dom";
import { actionValues } from "../../features/constants";

const ContractItem = () => {
  const { action } = useParams();

  const tabsItem = [
    { id: 1, label: "Code", item: <div>Code</div> },
    { id: 2, label: "Read Contract", item: <ReadContract /> },
    { id: 3, label: "Write Contract", item: <WriteContract /> },
  ];
  return (
    <div>
      <Tabs
        type="card"
        items={tabsItem.map(item => {
          return {
            label: item.label,
            key: String(item.id),
            children: item.item,
          };
        })}
        defaultActiveKey={actionValues[action]}
      />
    </div>
  );
};

export default ContractItem;
