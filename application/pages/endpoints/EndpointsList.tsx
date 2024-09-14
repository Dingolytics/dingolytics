import { isEmpty } from "@lodash";
import React from "react";
import { Table, Typography, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
const { Text } = Typography;

import { EndpointType } from "@/services/EndpointsService";
import navigateTo from "@/components/router/navigateTo";

type ListComponentProps = {
  items: any[];
}

const endpointsColumns: ColumnsType<EndpointType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    "width": "35%",
    render: (_, item) => <Text strong>{item.name}</Text>
  },
  {
    title: "URL",
    dataIndex: "key",
    key: "key",
    "width": "40%",
    render: (_, item) => <Text copyable>{item.key}</Text>
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

const EndpointsList: React.FC<ListComponentProps> = ({ items }) =>
{
  return isEmpty(items) ? (
    <Text>There are no endpoints published yet.</Text>
  ) : (
    <Table
      showHeader={false}
      columns={endpointsColumns}
      rowKey={(item) => item.id}
      dataSource={items}
      pagination={false}
      size="middle"
    />
  );
}

export default EndpointsList;
