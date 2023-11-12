/** General */
import { Component } from "react";
import { Breadcrumb, Button, Select, Space, Typography } from "antd";
const { Title, Text } = Typography;

/** Components utils */
import navigateTo from "@/components/router/navigateTo";
import routeWithUserSession from "@/components/router/routeWithUserSession";

/** Services */
import routes from "@/services/routes";
import Query, { QueryType } from "@/services/query";

/** Components */
import WidgetsListPredefined from "./WidgetsListPredefined"

/** Type definitions */
type WidgetsPageProps = {
  queryId?: string;
  onError?: (error: Error) => void;
}

type WidgetsPageState = {
  queries: QueryType[];
  loading: boolean;
}

/** Component definition */
class WidgetsList extends Component<WidgetsPageProps, WidgetsPageState> {
  state: WidgetsPageState = {
    queries: [],
    loading: true,
  };

  componentDidMount() {
    // console.log("[componentDidMount]", this.props)
    this.reloadState();
  }

  componentWillUnmount() {
    // ...
  }

  reloadState() {
    Query.query({}).then((data) => {
      this.setState({
        queries: data.results,
        loading: false
      })

      if (data.results && !this.props.queryId) {
        navigateTo(`widgets/${data.results[0].id}`, true)
      }
    })
  }

  onQuerySelected(queryId: number) {
    // console.log("[onQuerySelected]", queryId)
    navigateTo(`widgets/${queryId}`, true)
  }

  render() {
    return (
      <Space direction="vertical" size="middle" style={{ display: "flex" }}>
        <Breadcrumb
          items={[
            {
              title: "Home",
              href: "/",
            },
            {
              title: "Widgets",
              // href: "/widgets",
            }
          ]}
        />

        <Select
          showSearch
          placeholder="Select a query..."
          onChange={this.onQuerySelected}
          options={this.state.queries.map((query) => {
            return {
              value: `${query.id}`,
              label: (
                <Text>
                  <Text strong>{query.name}</Text>
                  <Text> </Text>
                  <Text type="secondary">
                    {query.description ? query.description : query.query}
                  </Text>
                </Text>
              )
            }
          })}
          // @ts-ignore, NOTE: Why is this complaining?!?
          defaultValue={
            this.props.queryId ? `${this.props.queryId}` : undefined
          }
          style={{ width: "100%" }}
        />

        {
          this.props.queryId && (
            <WidgetsListPredefined queryId={this.props.queryId} />
          )
        }
      </Space>
    )
  }
}

const WidgetsListPage = WidgetsList;

routes.register(
  "Widgets.List",
  routeWithUserSession({
    path: "/widgets",
    title: "Widgets",
    render: (pageProps) => (
      <WidgetsListPage {...pageProps} />
    ),
  })
);

routes.register(
  "Widgets.View",
  routeWithUserSession({
    path: "/widgets/:queryId",
    title: "Widgets",
    render: (pageProps) => (
      <WidgetsListPage {...pageProps} />
    ),
  })
);
