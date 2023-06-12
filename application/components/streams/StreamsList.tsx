import { isEmpty } from "@lodash";
import React from "react";
import { Space, Table, Typography, Button } from "antd";
// import { Dropdown } from "antd";
// import DownOutlinedIcon from "@ant-design/icons/DownCircleOutlined";
import type { ColumnsType } from "antd/es/table";
const { Text } = Typography;

import { DataSourceType } from "@/services/data-source";
import { StreamType } from "@/services/stream";
import DatabaseItem from "@/components/databases/DatabaseItem";
import InputWithCopy from "@/components/general/InputWithCopy";
import navigateTo from "@/components/router/navigateTo";

type ListComponentProps = {
  items: any[];
}

const groupColumns: ColumnsType<DataSourceType> = [
  {
    title: "Database",
    dataIndex: "name",
    key: "name",
    render: (_, item) => <DatabaseItem item={item} text={{strong: true}} />,
  }
]

const settingsDropdownProps = {
  items: [
    {
      label: "Stop",
      key: "stop",
      danger: true,
    }
  ],
  onClick: (item: object) => console.log(item),
};

const streamsColumns: ColumnsType<StreamType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (_, item) => <Text strong>{item.name}</Text>,
    "width": "35%",
  },
  {
    title: "Table name",
    dataIndex: "db_table",
    key: "db_table",
    "width": "40%",
    render: (_, item) => (
      <Space.Compact>
        <InputWithCopy value={item.db_table} readOnly />
      </Space.Compact>
    ),
  },
  {
    title: "",
    dataIndex: "id",
    key: "id",
    "width": "25%",
    render: (_, item) => (
      <Button
        type="text"
        // menu={settingsDropdownProps}
        onClick={() => navigateTo(`data-sources/streams/${item.id}`)}
        // icon={<DownOutlinedIcon />}
      >
        Settings
      </Button>
    )
  }
]

const StreamsList: React.FC<ListComponentProps> = ({ items }) =>
{
  return isEmpty(items) ? (
    <Text>There are no streams configured yet.</Text>
  ) : (
    <Table
      columns={streamsColumns}
      rowKey={(item) => item.id}
      dataSource={items}
      pagination={false}
      size="middle"
    />
  );
}

const GrouppedStreamsList: React.FC<ListComponentProps> = ({ items }) =>
{
  const expandedRowRender = (row: DataSourceType) => {
    return <StreamsList items={row.streams!} />;
  };
  
  return isEmpty(items) ? (
    <Text>There are no streams configured yet.</Text>
  ) : (
    <Table
      columns={groupColumns}
      rowKey={(item) => `${item.id}`}
      dataSource={items}
      pagination={false}
      expandable={{
        expandedRowRender,
        defaultExpandAllRows: true,
        expandRowByClick: true,
      }}
      showHeader={false}
      size="middle"
      // bordered
    />
  );
}

export { GrouppedStreamsList };

export default StreamsList;
