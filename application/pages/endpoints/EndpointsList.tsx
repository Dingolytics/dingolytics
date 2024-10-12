import { isEmpty } from "@lodash";
import React from "react";
import { Table, Typography, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
const { Text } = Typography;

import Link from "@/components/general/Link";
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
    render: (_, item) => <Link href={`/endpoints/${item.id}`}>{item.name}</Link>
  },
  {
    title: "URL",
    dataIndex: "url",
    key: "url",
    "width": "40%",
    render: (_, item) => <Text copyable>{item.url}</Text>
  },
  {
    title: "Tags",
    dataIndex: "tags",
    key: "tags",
    "width": "25%",
    render: (_, item) => <Text>{JSON.stringify(item.tags)}</Text>
  },
  /*{
    title: "",
    dataIndex: "id",
    key: "id",
    "width": "25%",
    render: (_, item) => (
      <Button
        type="text"
        // menu={settingsDropdownProps}
        onClick={() => navigateTo(`endpoints/${item.id}`)}
        // icon={<DownOutlinedIcon />}
      >
        Configure
      </Button>
    )
  }*/
]

const EndpointsList: React.FC<ListComponentProps> = ({ items }) =>
{
  return isEmpty(items) ? (
    <Text>There are no endpoints published yet.</Text>
  ) : (
    <Table
      showHeader={true}
      columns={endpointsColumns}
      rowKey={(item) => item.id}
      dataSource={items}
      pagination={false}
      size="middle"
    />
  );
}

export default EndpointsList;
