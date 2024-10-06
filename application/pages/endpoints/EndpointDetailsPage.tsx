/** General */
import { Component } from "react";
import { Breadcrumb, Space, Typography } from "antd";
const { Text, Paragraph } = Typography;

/** Components */
import LoadingState from "@/components/items-list/components/LoadingState";
// import navigateTo from "@/components/router/navigateTo";
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
            <Text>
              {JSON.stringify(this.state.endpointItem)}
            </Text>
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
