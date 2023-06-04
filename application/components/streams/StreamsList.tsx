import { isEmpty } from "@lodash";
import React from "react";
import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
const { Text } = Typography;

import { DataSourceType } from "@/services/data-source";
import { StreamType } from "@/services/stream";
import DatabaseItem from "@/components/databases/DatabaseItem";

type ListComponentProps = {
  items: any[];
}

const groupColumns: ColumnsType<DataSourceType> = [
  {
    title: "Database",
    dataIndex: "name",
    key: "name",
    render: (_, item) => <DatabaseItem item={item} text={{strong: true}} />,
  },
]

const streamsColumns: ColumnsType<StreamType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  },
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
      // showHeader={false}
      size="middle"
      // bordered
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
      bordered
    />
  );
}

export { GrouppedStreamsList };

export default StreamsList;
