import { isEmpty, reject } from "@lodash";
import { Component } from "react";
import { Button, Space, Table, Image, Col, Row, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
const { Title, Text } = Typography;

import DataSource, { IMG_ROOT } from "@/services/data-source";
import Stream, { StreamType } from "@/services/stream";
import { policy } from "@/services/policy";
import recordEvent from "@/services/recordEvent";
import routes from "@/services/routes";

import Link from "@/components/general/Link";
import routeWithUserSession from "@/components/router/routeWithUserSession";
import navigateTo from "@/components/router/navigateTo";
import LoadingState from "@/components/items-list/components/LoadingState";
import CreateSourceDialog from "@/components/settings/CreateSourceDialog";
import helper from "@/components/dynamic-form/dynamicFormHelper";
import wrapSettingsTab from "@/components/settings/SettingsWrapper";
import CreateStreamDialog from "@/components/settings/CreateStreamDialog";

type ListComponentProps = {
  items: any[];
}

type DatabasesListProps = {
  isNewDataSourcePage?: boolean;
  onError?: (error: Error) => void;
}

type DatabasesListState = {
  dataSourceTypes: any[];
  dataSources: any[];
  streams: StreamType[];
  loading: boolean;
}

type DatabasesListItem = {
  title: string;
  imgSrc: string;
  href: string;
}

const databasesColumns: ColumnsType<DatabasesListItem> = [
  {
    title: "Name",
    dataIndex: "title",
    key: "title",
    render: (_, item) => (
      <Space><Image src={item.imgSrc} /> {item.title}</Space>
    ),
  },
  {
    title: "Settings",
    dataIndex: "href",
    key: "href",
    render: (value) => <Link href={value}>Settings</Link>,
  }
]

const streamsColumns: ColumnsType<StreamType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name"
  }
]

const DatabasesListComponent: React.FC<ListComponentProps> = ({ items }) =>
{
  items = items.map((dataSource) => ({
    title: dataSource.name,
    imgSrc: `${IMG_ROOT}/${dataSource.type}.png`,
    href: `data-sources/${dataSource.id}`,
  }));

  return isEmpty(items) ? (
    <Text>There are no databases connected yet.</Text>
  ) : (
    <Table
      columns={databasesColumns}
      rowKey={(item) => item.href}
      dataSource={items}
      pagination={false}
      showHeader={false}
      size="middle"
      bordered
    />
  );
}

const StreamsListComponent: React.FC<ListComponentProps> = ({ items }) =>
{
  return isEmpty(items) ? (
    <Text>There are no streams configured yet.</Text>
  ) : (
    <Table
      columns={streamsColumns}
      rowKey={(item) => item.id}
      dataSource={items}
      pagination={false}
      showHeader={false}
      size="middle"
      bordered
    />
  );
}

class DataSourcesList extends Component<DatabasesListProps, DatabasesListState> {
  state: DatabasesListState = {
    dataSourceTypes: [],
    dataSources: [],
    streams: [],
    loading: true,
  };

  private streamDialog: any = null;

  private databaseDialog: any = null;

  componentDidMount() {
    this.reloadState();
  }

  componentWillUnmount() {
    if (this.databaseDialog) {
      this.databaseDialog.dismiss();
    }

    if (this.streamDialog) {
      this.streamDialog.dismiss();
    }
  }

  reloadState = () => {
    Promise.all([DataSource.query(), DataSource.types(), Stream.query()])
      .then((values) =>
        this.setState(
          {
            dataSources: values[0],
            dataSourceTypes: values[1],
            streams: values[2],
            loading: false,
          },
          () => {
            if (this.props.isNewDataSourcePage) {
              if (policy.canCreateDataSource()) {
                this.showCreateSourceDialog();
              } else {
                navigateTo("data-sources", true);
              }
            }
          }
        )
      )
      .catch((error) => this.props.onError?.(error));
  }

  createDataSource = (selectedType: any, values: any): Promise<any> => {
    const target = { options: {}, type: selectedType.type, name: values.name };
    helper.updateTargetWithValues(target, values);
    return DataSource.create(target).then((dataSource) => {
      this.setState({ loading: true });
      DataSource.query()
        .then((dataSources) => this.setState(
          { dataSources, loading: false }
        ));
      return dataSource;
    });
  };

  showCreateSourceDialog = () => {
    recordEvent("view", "page", "data-sources/new");

    this.databaseDialog = CreateSourceDialog.showModal({
      types: reject(this.state.dataSourceTypes, "deprecated"),
      sourceType: "Data Source",
      imageFolder: IMG_ROOT,
      helpTriggerPrefix: "DS_",
      onCreate: this.createDataSource,
    });

    this.databaseDialog
      .onClose((result = {success: false, data: {id: null}}) => {
        this.databaseDialog = null;
        if (result.success) {
          navigateTo(`data-sources/${result.data.id}`);
        }
      })
      .onDismiss(() => {
        this.databaseDialog = null;
        navigateTo("data-sources", true);
      });
  };

  showCreateStreamDialog = () => {
    const dialog = CreateStreamDialog.showModal({});

    dialog.onClose((result = {success: false, data: {id: null}}) => {
      this.streamDialog = null;
      if (result.success) {
        this.reloadState();
      }
    });

    dialog.onDismiss(() => {
      this.streamDialog = null;
      navigateTo("data-sources", true);
    });

    this.streamDialog = dialog;
  }

  render() {
    const allowCreation = policy.isCreateDataSourceEnabled();

    return (
      <div>
        {
          this.state.loading ? (
            <LoadingState className="" />
          ) : (
            <Row>
              <Col span={24} lg={{span: 16}}>
                <DatabasesListComponent
                  items={this.state.dataSources}
                />
              </Col>
            </Row>
          )
        }
        <Space style={{marginTop: "1rem"}}>
          <Button
            type="primary"
            disabled={!allowCreation}
            onClick={
              allowCreation ? this.showCreateSourceDialog : undefined
            }
          >
            Connect a Database
          </Button>
        </Space>

        <Title level={4}>
          Data streams
        </Title>

        {
          this.state.loading ? (
            <LoadingState className="" />
          ) : (
            <Row>
              <Col span={24} lg={{span: 16}}>
                <StreamsListComponent
                  items={this.state.streams}
                />
              </Col>
            </Row>
          )
        }

        <Space style={{marginTop: "1rem"}}>
          <Button
            type="primary"
            disabled={!allowCreation}
            onClick={
              allowCreation ? this.showCreateStreamDialog : undefined
            }
          >
            Add Stream
          </Button>
        </Space>
      </div>
    );
  }
}

const DataSourcesListPage = wrapSettingsTab(
  "DataSources.List",
  {
    permission: "admin",
    title: "Databases",
    path: "data-sources",
    order: 1,
  },
  DataSourcesList
);

routes.register(
  "DataSources.List",
  routeWithUserSession({
    path: "/data-sources",
    title: "Databases",
    render: (pageProps) => (
      <DataSourcesListPage {...pageProps} />
    ),
  })
);

routes.register(
  "DataSources.New",
  routeWithUserSession({
    path: "/data-sources/new",
    title: "Databases",
    render: (pageProps) => (
      <DataSourcesListPage isNewDataSourcePage {...pageProps} />
    ),
  })
);
