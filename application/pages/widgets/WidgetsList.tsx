/** General */
import { Component } from "react";
import { Breadcrumb, Button, Select, Space, Typography } from "antd";
const { Title, Text } = Typography;

/** Components */
import CreateStreamDialog from "@/components/streams/CreateStreamDialog";
import LoadingState from "@/components/items-list/components/LoadingState";
import { GrouppedStreamsList} from "@/components/streams/StreamsList";
import navigateTo from "@/components/router/navigateTo";
import routeWithUserSession from "@/components/router/routeWithUserSession";

/** Services */
import routes from "@/services/routes";
import Query, { QueryType } from "@/services/query";
import Stream, { StreamType } from "@/services/stream";

/** Type definitions */
type WidgetsPageProps = {
  onError?: (error: Error) => void;
}

type WidgetsPageState = {
  queries: QueryType[];
  selectedQuery?: QueryType;
  loading: boolean;
}

/** Component definition */
class WidgetsList extends Component<WidgetsPageProps, WidgetsPageState> {
  state: WidgetsPageState = {
    queries: [],
    selectedQuery: undefined,
    loading: true,
  };

  componentDidMount() {
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
      // console.log(result)
    })
  }

  onQuerySelected(value: number) {
    console.log("[onQuerySelected]", value)
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
              value: query.id,
              label: (
                <Text>
                  <Text strong>{query.name}</Text>
                  <Text> </Text>
                  <Text type="secondary">
                    {query.description ? query.description : query.query}
                  </Text>
                </Text>
              )
              // label: query.name + (
              //   query.description ?
              //     ` (${query.description})` :
              //     "<span>ddd</span>"
              //     // ` (${query.query})`
              // ),
            }
          })}
          style={{ width: "100%" }}
        />
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
