/** General */
import React, { Component } from "react";
import { Breadcrumb, Space, Typography } from "antd";
const { Title, Paragraph } = Typography;

/** Components */
import LoadingState from "@/components/items-list/components/LoadingState";
// import navigateTo from "@/components/router/navigateTo";
import routeWithUserSession from "@/components/router/routeWithUserSession";
import EndpointsList from "@/pages/endpoints/EndpointsList";

/** Services */
import RoutesService from "@/services/routes";
import EndpointsService, { EndpointType } from "@/services/EndpointsService";

type EndpointsPageProps = {
  onError?: (error: Error) => void;
}

type EndpointsPageState = {
  endpointItems: EndpointType[];
  loading: boolean;
}

class EndpointsPage extends Component<EndpointsPageProps, EndpointsPageState> {
  state: EndpointsPageState = {
    endpointItems: [],
    loading: true,
  };

  reloadState = () => {
    Promise.all([EndpointsService.query()])
      .then((values) => {
        let [endpointItems] = values;
        this.setState(
          { endpointItems: endpointItems, loading: false },
          () => { /* ... */ }
        )
      })
      .catch((error) => this.props.onError?.(error));
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
            },
          ]}
        />

        <Paragraph>
          Streams are the core of your data collection pipeline.
          Each stream corresponds to a table in your database, and ingest
          endpoint is generated for each stream. Learn more about streams in
          the <a>&ldquo;Documentation / Streams&rdquo;</a> chapter.
        </Paragraph>

        {
          this.state.loading ? (
            <LoadingState className="" />
          ) : (
            <EndpointsList
              items={this.state.endpointItems}
            />
          )
        }
      </Space>
    );
  }
}

RoutesService.register(
  "Endpoints.List",
  routeWithUserSession({
    path: "/endpoints",
    title: "Endpoints",
    render: (pageProps) => (
      <EndpointsPage {...pageProps} />
    ),
  })
);
