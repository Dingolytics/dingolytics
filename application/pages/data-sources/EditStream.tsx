import React from "react";
import { Col, Row, Table } from "antd";
// import Modal from "antd/lib/modal";
import routeWithUserSession from "@/components/router/routeWithUserSession";
// import navigateTo from "@/components/router/navigateTo";
import LoadingState from "@/components/items-list/components/LoadingState";
// import DynamicForm from "@/components/dynamic-form/DynamicForm";
import wrapSettingsTab from "@/components/settings/SettingsWrapper";
import routes from "@/services/routes";
import Stream, { StreamType } from "@/services/stream";

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

const EditStreamForm: React.FC<EditStreamFormProps> = ({ stream }) => {
  const data = [
    // {"name": "Stream name", "value": stream.name},
    {"name": "Database table", "value": stream.db_table},
    // {"name": "Table preset", "value": stream.db_table_preset},
    {"name": "Ingest URL", "value": stream.ingest_url},
  ]

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (value: string) => <b>{value}</b>,
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
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
