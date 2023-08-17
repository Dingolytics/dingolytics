import { isEmpty, reject } from "@lodash";
import React, { Component } from "react";
import { Button, Space, Table, Col, Row, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
const { Text } = Typography;

import DataSource, { DataSourceType } from "@/services/data-source";
import { IMG_ROOT } from "@/services/data-source";
import { policy } from "@/services/policy";
import recordEvent from "@/services/recordEvent";
import routes from "@/services/routes";

import routeWithUserSession from "@/components/router/routeWithUserSession";
import navigateTo from "@/components/router/navigateTo";
import LoadingState from "@/components/items-list/components/LoadingState";
import CreateSourceDialog from "@/components/settings/CreateSourceDialog";
import dynamicFormHelper from "@/components/dynamic-form/dynamicFormHelper";
import wrapSettingsTab from "@/components/settings/SettingsWrapper";
import DatabaseItem from "@/components/databases/DatabaseItem";

type ListComponentProps = {
  items: any[];
}

type DataSourcesPageProps = {
  isNewDataSourcePage?: boolean;
  onError?: (error: Error) => void;
}

type DataSourcesPageState = {
  dataSourceTypes: any[];
  dataSources: any[];
  loading: boolean;
}

const databasesColumns: ColumnsType<DataSourceType> = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (_, item) => (
      <div className="clickable"
        onClick={() => navigateTo(`data-sources/${item.id}`)}
      >
        <DatabaseItem item={item} text={{strong: true}}/>
      </div>
    ),
  }
]

const DatabasesListComponent: React.FC<ListComponentProps> = ({ items }) =>
{
  return isEmpty(items) ? (
    <Text>There are no databases connected yet.</Text>
  ) : (
    <Table
      columns={databasesColumns}
      rowKey={(item) => item.id}
      dataSource={items}
      pagination={false}
      showHeader={false}
      size="middle"
      bordered
    />
  );
}

class DataSourcesList extends Component<DataSourcesPageProps, DataSourcesPageState> {
  state: DataSourcesPageState = {
    dataSourceTypes: [],
    dataSources: [],
    loading: true,
  };

  private databaseDialog: any = null;

  componentDidMount() {
    this.reloadState();
  }

  componentWillUnmount() {
    if (this.databaseDialog) {
      this.databaseDialog.dismiss();
    }
  }

  reloadState = () => {
    Promise.all([DataSource.query(), DataSource.types()])
      .then((values) => {
        let [dataSources, dataSourceTypes] = values;
        this.setState(
          { dataSources, dataSourceTypes, loading: false },
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
      })
      .catch((error) => this.props.onError?.(error));
  }

  createDataSource = (selectedType: any, values: any): Promise<any> => {
    const target = { options: {}, type: selectedType.type, name: values.name };
    dynamicFormHelper.updateTargetWithValues(target, values);
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
