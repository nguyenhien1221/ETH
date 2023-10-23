import React from "react";
import { Tabs } from "antd";
import "../ContractItem/ContractItem.css";
import ReadContract from "../../features/ReadContract/ReadContract";
import WriteContract from "../../features/WriteContract/WriteContract";

const ContractItem = () => {
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
      />
    </div>
  );
};

export default ContractItem;
