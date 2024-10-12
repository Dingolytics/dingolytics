/** General */
import { Component } from "react";
import { Breadcrumb, Col, Row, Space, Table, Typography } from "antd";
const { Text, Paragraph } = Typography;

/** Components */
import LoadingState from "@/components/items-list/components/LoadingState";
import routeWithUserSession from "@/components/router/routeWithUserSession";

/** Services */
import RoutesService from "@/services/routes";
import EndpointsService, { EndpointType } from "@/services/EndpointsService";

type EndpointDetailsPageProps = {
  endpointId?: string;
  onError?: (error: Error) => void;
}

type EndpointDetailsPageState = {
  endpointItem: EndpointType | null;
  loading: boolean;
}

type RowType = {
  name: string;
  value: string | null | undefined;
  pre?: boolean | undefined;
  attrs?: object | undefined;
  copyable?: boolean | undefined;
}

class EndpointDetailsPage extends Component<EndpointDetailsPageProps, EndpointDetailsPageState> {
  state: EndpointDetailsPageState = {
    endpointItem: null,
    loading: true,
  };

  reloadState = () => {
    const { endpointId } = this.props;
    if (endpointId) {
      Promise.all([EndpointsService.get({ id: endpointId })])
      .then((values) => {
        let [endpointItem] = values;
        this.setState(
          { endpointItem, loading: false },
          () => { /* ... */ }
        )
      })
      .catch((error) => this.props.onError?.(error));
    }
  }

  componentDidMount() {
    this.reloadState();
  }

  render() {
    const item = this.state.endpointItem;

    const fullURL = item ? `${location.origin}${item.url}` : "";

    const data = item ? [
      {"name": "Description", "value": item.description},
      {"name": "Endpoint URL", "value": fullURL, "attrs": {"copyable": true}},
      {"name": "SQL (parameterized)", "value": item.query_text, "attrs": {"copyable": true, "code": true}},
      {"name": "Parameters", "value": JSON.stringify(item.parameters), "pre": true},
    ] : []

    const columns = [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Value",
        dataIndex: "value",
        key: "value",
        render: (_: any, item: RowType) => (
          item.pre ? (
            <pre style={{margin: 0, padding: 0}}>
              <Text {...(item.attrs || {})}>{item.value}</Text>
            </pre>
          ) : (
            <Text {...(item.attrs || {})}>{item.value}</Text>
          )
        ),
      }
    ]

    return (
      <Space direction="vertical">
        <Breadcrumb
          items={[
            {
              title: "Home",
              href: "/",
            },
            {
              title: "Endpoints",
              href: "/endpoints",
            },
            {
              title: this.state.endpointItem?.name || "...",
            },
          ]}
        />

        <Paragraph>
          Endpoints expose published query results for various use cases, such as view counters,
          monitoring, and product metrics.
          <br />Learn more in the <a>&ldquo;Documentation / Endpoints&rdquo;</a> chapter.
        </Paragraph>

        {
          this.state.loading ? (
            <LoadingState className="" />
          ) : (
            <Row>
              <Col span={24} lg={{span: 16}}>
                <h3>{item!.name}</h3>

                <Table
                  showHeader={false}
                  columns={columns}
                  rowKey={(item) => item.name}
                  dataSource={data}
                  pagination={false}
                  size="middle"
                />
              </Col>
            </Row>
          )
        }
      </Space>
    );
  }
}

RoutesService.register(
  "Endpoints.Details",
  routeWithUserSession({
    path: "/endpoints/:endpointId",
    title: "Endpoints",
    render: (pageProps) => (
      <EndpointDetailsPage {...pageProps} />
    ),
  })
);
