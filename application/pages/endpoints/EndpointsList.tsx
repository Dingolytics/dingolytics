import { isEmpty } from "@lodash";
import React from "react";
import { Table, Typography, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
const { Text } = Typography;

import Link from "@/components/general/Link";
import { EndpointType } from "@/services/EndpointsService";
// import navigateTo from "@/components/router/navigateTo";

type ListComponentProps = {
  items: any[];
}

function paramsToQueryString(params: { name: string; value: any }[]): string {
  return params?.length ? '?' + params
    .map(({ name, value }) => `${encodeURIComponent(`p_${name}`)}=${encodeURIComponent(value)}`)
    .join('&') : '';
}

const endpointsColumns: ColumnsType<EndpointType> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    "width": "5%",
    render: (_, item) => <Text>{item.id}</Text>
  },
  {
    title: "Name",
    "width": "25%",
    render: (_, item) => <Link href={`/endpoints/${item.id}`}>{item.name}</Link>
  },
  {
    title: "URL",
    "width": "35%",
    render: (_, item) => (
      <Text
        style={{width: 240}}
        ellipsis={true}
        copyable
      >{`${item.url}${paramsToQueryString(item.parameters)}`}</Text>
    )
  },
  {
    title: "Parameters",
    "width": "20%",
    render: (_, item) => <Text>{paramsToQueryString(item.parameters)}</Text>
  },
  {
    title: "Tags",
    "width": "15%",
    render: (_, item) => <Text>{item.tags.join(', ')}</Text>
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
