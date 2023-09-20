import React from 'react'
import { Breadcrumb, Button, Card, Space, Typography } from "antd";
const { Title, Text } = Typography;

type ListProps = {
  queryId: string;
}

type SampleProps = {
  title: string;
  url: string;
}

const WidgetSample: React.FC<SampleProps> = (props) => {
  return (
    <Card title={props.title} bordered={false}>
      <Space direction="vertical">
        <Text copyable={true}>{props.url}</Text>
        <iframe src={props.url} width="100%" height="64"></iframe>
      </Space>
    </Card>
    // <Space direction="vertical">
    //   <Title level={3}>{props.title}</Title>
    //   <Text copyable={true}>{props.url}</Text>
    //   <iframe src={props.url} width="100%"></iframe>
    // </Space>
  )
}

const WidgetsListPredefined: React.FC<ListProps> = (props) => {
  var loc = window.location
  const baseUrl = `${loc.protocol}//${loc.host}/ext/widgets/${props.queryId}`
  return (
    <div>
      <WidgetSample
        title="Plain number (SVG)"
        url={`${baseUrl}/plain.svg`}
      />
    </div>
  )
}

export default WidgetsListPredefined
