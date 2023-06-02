import { isEmpty, reject } from "@lodash";
import { Component, ReactElement } from "react";
import { Button, Space, Table, Image, Col, Row, Divider } from "antd";
import type { ColumnsType } from "antd/es/table";

import DataSource, { IMG_ROOT } from "@/services/data-source";
import { policy } from "@/services/policy";
import recordEvent from "@/services/recordEvent";
import routes from "@/services/routes";

import Link from "@/components/general/Link";
import routeWithUserSession from "@/components/router/routeWithUserSession";
import navigateTo from "@/components/router/navigateTo";
import LoadingState from "@/components/items-list/components/LoadingState";
import CreateSourceDialog from "@/components/settings/CreateSourceDialog";
import DynamicComponent, { registerComponent } from "@/components/general/DynamicComponent";
import helper from "@/components/dynamic-form/dynamicFormHelper";
import wrapSettingsTab from "@/components/settings/SettingsWrapper";
import CreateStreamDialog from "@/components/settings/CreateStreamDialog";

interface DataSourcesListComponentProps {
  dataSources: any[];
}

interface DataSourcesListProps {
  isNewDataSourcePage?: boolean;
  onError?: (error: Error) => void;
}

interface DataSourcesListState {
  dataSourceTypes: any[];
  dataSources: any[];
  loading: boolean;
}

interface DataType {
  title: string;
  imgSrc: string;
  href: string;
}

const columns: ColumnsType<DataType> = [
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
    dataIndex: 'href',
    key: 'href',
    render: (value) => <Link href={value}>Settings</Link>,
  }
]

function DataSourcesListComponent({ dataSources }: DataSourcesListComponentProps): ReactElement {
  const items = dataSources.map((dataSource) => ({
    title: dataSource.name,
    imgSrc: `${IMG_ROOT}/${dataSource.type}.png`,
    href: `data-sources/${dataSource.id}`,
  }));

  return isEmpty(dataSources) ? (
    <div className="text-center">
      There are no data sources yet.
    </div>
  ) : (
    <Table
      columns={columns}
      dataSource={items}
      pagination={false}
      showHeader={false}
      size="middle"
      bordered
    />
  );
}

registerComponent("DataSourcesListComponent", DataSourcesListComponent);

class DataSourcesList extends Component<DataSourcesListProps, DataSourcesListState> {
  state: DataSourcesListState = {
    dataSourceTypes: [],
    dataSources: [],
    loading: true,
  };

  private newDataSourceDialog: any = null;

  componentDidMount() {
    Promise.all([DataSource.query(), DataSource.types()])
      .then((values) =>
        this.setState(
          {
            dataSources: values[0],
            dataSourceTypes: values[1],
            loading: false,
          },
          () => {
            // all resources are loaded in state
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

  componentWillUnmount() {
    if (this.newDataSourceDialog) {
      this.newDataSourceDialog.dismiss();
    }
  }

  createDataSource = (selectedType: any, values: any): Promise<any> => {
    const target = { options: {}, type: selectedType.type };
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

    this.newDataSourceDialog = CreateSourceDialog.showModal({
      types: reject(this.state.dataSourceTypes, "deprecated"),
      sourceType: "Data Source",
      imageFolder: IMG_ROOT,
      helpTriggerPrefix: "DS_",
      onCreate: this.createDataSource,
    });

    this.newDataSourceDialog
      .onClose((result = {success: false, data: {id: null}}) => {
        this.newDataSourceDialog = null;
        if (result.success) {
          navigateTo(`data-sources/${result.data.id}`);
        }
      })
      .onDismiss(() => {
        this.newDataSourceDialog = null;
        navigateTo("data-sources", true);
      });
  };

  render() {
    const newDataSourceProps = {
      onClick: policy.isCreateDataSourceEnabled() ? this.showCreateSourceDialog : undefined,
      disabled: !policy.isCreateDataSourceEnabled(),
      "data-test": "CreateDataSourceButton",
    };

    return (
      <div>
        {
          this.state.loading ? (
            <LoadingState className="" />
          ) : (
            <Row>
              <Col span={24} lg={{span: 16}}>
                <DynamicComponent
                  name="DataSourcesListComponent"
                  dataSources={this.state.dataSources}
                />
              </Col>
            </Row>
          )
        }
        <br />
        <Space>
          <Button type="primary" {...newDataSourceProps}>
            Connect a Database
          </Button>
          <Button
            type="default"
            onClick={() => {
              CreateStreamDialog.showModal({
              });
            }}
          >
            Add Stream
          </Button>

          <DynamicComponent name="DataSourcesListExtra" />
        </Space>
      </div>
    );
  }
}

const DataSourcesListPage = wrapSettingsTab(
  "DataSources.List",
  {
    permission: "admin",
    title: "Data Sources",
    path: "data-sources",
    order: 1,
  },
  DataSourcesList
);

routes.register(
  "DataSources.List",
  routeWithUserSession({
    path: "/data-sources",
    title: "Data Sources",
    render: (pageProps) => <DataSourcesListPage {...pageProps} />,
  })
);

routes.register(
  "DataSources.New",
  routeWithUserSession({
    path: "/data-sources/new",
    title: "Data Sources",
    render: (pageProps) => <DataSourcesListPage {...pageProps} isNewDataSourcePage />,
  })
);
