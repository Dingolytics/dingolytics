import { isEmpty, reject } from "@lodash";
import React from "react";
import PropTypes from "prop-types";

import Button from "antd/lib/button";
import Space from "antd/lib/space";
import routeWithUserSession from "@/components/router/routeWithUserSession";
import navigateTo from "@/components/router/navigateTo";
import CardsList from "@/components/general/CardsList";
import LoadingState from "@/components/items-list/components/LoadingState";
import CreateSourceDialog from "@/components/settings/CreateSourceDialog";
import DynamicComponent, { registerComponent } from "@/components/general/DynamicComponent";
import helper from "@/components/dynamic-form/dynamicFormHelper";
import wrapSettingsTab from "@/components/settings/SettingsWrapper";
import CreateStreamDialog from "@/components/settings/CreateStreamDialog";

import DataSource, { IMG_ROOT } from "@/services/data-source";
import { policy } from "@/services/policy";
import recordEvent from "@/services/recordEvent";
import routes from "@/services/routes";

export function DataSourcesListComponent({ dataSources, onClickCreate }) {
  const items = dataSources.map(dataSource => ({
    title: dataSource.name,
    imgSrc: `${IMG_ROOT}/${dataSource.type}.png`,
    href: `data-sources/${dataSource.id}`,
  }));

  return isEmpty(dataSources) ? (
    <div className="text-center">
      There are no data sources yet.
    </div>
  ) : (
    <CardsList items={items} />
  );
}

registerComponent("DataSourcesListComponent", DataSourcesListComponent);

class DataSourcesList extends React.Component {
  static propTypes = {
    isNewDataSourcePage: PropTypes.bool,
    onError: PropTypes.func,
  };

  static defaultProps = {
    isNewDataSourcePage: false,
    onError: () => {},
  };

  state = {
    dataSourceTypes: [],
    dataSources: [],
    loading: true,
  };

  newDataSourceDialog = null;

  componentDidMount() {
    Promise.all([DataSource.query(), DataSource.types()])
      .then(values =>
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
      .catch(error => this.props.onError(error));
  }

  componentWillUnmount() {
    if (this.newDataSourceDialog) {
      this.newDataSourceDialog.dismiss();
    }
  }

  createDataSource = (selectedType, values) => {
    const target = { options: {}, type: selectedType.type };
    helper.updateTargetWithValues(target, values);

    return DataSource.create(target).then(dataSource => {
      this.setState({ loading: true });
      DataSource.query().then(dataSources => this.setState({ dataSources, loading: false }));
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
      .onClose((result = {}) => {
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
      type: "primary",
      onClick: policy.isCreateDataSourceEnabled() ? this.showCreateSourceDialog : null,
      disabled: !policy.isCreateDataSourceEnabled(),
      "data-test": "CreateDataSourceButton",
    };

    return (
      <div>
        <Space>
          <Button {...newDataSourceProps}>
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

        {this.state.loading ? (
          <LoadingState className="" />
        ) : (
          <DynamicComponent
            name="DataSourcesListComponent"
            dataSources={this.state.dataSources}
            onClickCreate={this.showCreateSourceDialog}
          />
        )}
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
    render: pageProps => <DataSourcesListPage {...pageProps} />,
  })
);
routes.register(
  "DataSources.New",
  routeWithUserSession({
    path: "/data-sources/new",
    title: "Data Sources",
    render: pageProps => <DataSourcesListPage {...pageProps} isNewDataSourcePage />,
  })
);
