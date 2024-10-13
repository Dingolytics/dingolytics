import React from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { Col, Row, Table, Typography } from "antd";
// import Modal from "antd/lib/modal";
import routeWithUserSession from "@/components/router/routeWithUserSession";
// import navigateTo from "@/components/router/navigateTo";
import LoadingState from "@/components/items-list/components/LoadingState";
// import DynamicForm from "@/components/dynamic-form/DynamicForm";
import wrapSettingsTab from "@/components/settings/SettingsWrapper";
import routes from "@/services/routes";
import Stream, { StreamType } from "@/services/stream";

const { Text } = Typography;

type EditStreamProps = {
  dataSourceId: string;
  streamId: string;
}

type EditStreamState = {
  loading: boolean;
  stream: StreamType | null;
}

interface EditStreamFormProps {
  stream: StreamType;
}

type RowType = {
  name: string;
  value: string;
  pre?: boolean | undefined;
}

const EditStreamForm: React.FC<EditStreamFormProps> = ({ stream }) => {
  const data = [
    // {"name": "Stream name", "value": stream.name},
    {"name": "Database table", "value": stream.db_table!},
    // {"name": "Table preset", "value": stream.db_table_preset},
    {"name": "Ingest URL", "value": stream.ingest_url!},
    {"name": "Schema (SQL)", "value": stream.db_table_query!, "pre": true},
  ]

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
            <Text copyable>{item.value}</Text>
          </pre>
        ) : (
          <Text code copyable>{item.value}</Text>
        )
      ),
    }
  ]

  return (
    <Row>
      <Col span={24} lg={{span: 16}}>
        <h3>{stream.name}</h3>
        <Table
          showHeader={false}
          columns={columns}
          rowKey={(item) => item.name}
          dataSource={data}
          pagination={false}
          size="middle"
        />

        <h4>Ingest example</h4>

        <pre style={{margin: 0, padding: 0}}>
          <SyntaxHighlighter language="bash">
            {stream.ingest_example.curl}
          </SyntaxHighlighter>
        </pre>
      </Col>
    </Row>
  )
}

class EditStream extends React.Component<EditStreamProps> {
  state: EditStreamState = {
    stream: null,
    loading: true,
  };

  componentDidMount() {
    const { streamId } = this.props;
    Stream.get({ id: Number(streamId) })
      .then((stream: StreamType) => this.setState({ stream, loading: false }))
      // .catch((error) => this.props.onError(error));
  }

  render() {
    return this.state.stream ? (
      <div>
        <EditStreamForm stream={this.state.stream} />
      </div>
    ) : (
      <LoadingState className="" />
    );
  }
}

const EditStreamPage = wrapSettingsTab("DataSources.EditStream", null, EditStream);

routes.register(
  "DataSources.EditStream",
  routeWithUserSession({
    path: "/data-sources/streams/:streamId",
    title: "Databases",
    render: pageProps => <EditStreamPage {...pageProps} />,
  })
);
