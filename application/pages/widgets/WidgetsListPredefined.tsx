import React from 'react'
import { Card, Space, Typography, Col, Row } from "antd";
const { Text } = Typography;

type ListProps = {
  queryId: string;
}

type SampleProps = {
  title: string;
  url: string;
  height: number;
}

const WidgetSample: React.FC<SampleProps> = (props) => {
  return (
    <Card title={props.title} bordered={false}>
      <Space direction="vertical">
        <Text copyable={true}>{props.url}</Text>
        <iframe src={props.url}
          width="100%" height={props.height}
        ></iframe>
      </Space>
    </Card>
  )
}

const WidgetsListPredefined: React.FC<ListProps> = (props) => {
  var loc = window.location
  const baseUrl = `${loc.protocol}//${loc.host}/ext/widgets/${props.queryId}`
  const shieldUrl = `https://img.shields.io/badge/dynamic/json?url=${baseUrl}/raw.json?p_application=main&query=$.data.rows[0].value&label=Events%20count`
  return (
    <Space direction="vertical">
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={8}>
          <WidgetSample
            title="Raw JSON"
            url={`${baseUrl}/raw.json`}
            height={120}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <WidgetSample
            title="Plain number (SVG)"
            url={`${baseUrl}/plain.svg`}
            height={60}
          />
        </Col>
        <Col xs={24} md={12} lg={8}>
          <WidgetSample
            title="Shields.io example"
            url={shieldUrl}
            height={60}
          />
        </Col>
      </Row>
    </Space>
  )
}

export default WidgetsListPredefined
