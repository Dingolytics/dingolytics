/** General */
import React, { Component } from "react";
import { Breadcrumb, Button, Space, Typography } from "antd";
const { Title, Paragraph } = Typography;

/** Components */
import CreateStreamDialog from "@/components/streams/CreateStreamDialog";
import LoadingState from "@/components/items-list/components/LoadingState";
import { DatabaseTitleItem } from "@/components/databases/DatabaseItem";
import StreamsList from "@/components/streams/StreamsList";
// import { GrouppedStreamsList } from "@/components/streams/StreamsList";
import navigateTo from "@/components/router/navigateTo";
import routeWithUserSession from "@/components/router/routeWithUserSession";

/** Services */
import DataSource, { annotateWithStreams } from "@/services/data-source";
// import recordEvent from "@/services/recordEvent";
import routes from "@/services/routes";
import { policy } from "@/services/policy";
import Stream, { StreamType } from "@/services/stream";

/** Type definitions */
type StreamsPageProps = {
  onError?: (error: Error) => void;
}

type StreamsPageState = {
  dataSourceTypes: any[];
  dataSources: any[];
  streams: StreamType[];
  loading: boolean;
}

/** Page component definition */
class StreamsPage extends Component<StreamsPageProps, StreamsPageState> {
  state: StreamsPageState = {
    dataSourceTypes: [],
    dataSources: [],
    streams: [],
    loading: true,
  };

  private streamDialog: any = null;

  componentDidMount() {
    this.reloadState();
  }

  componentWillUnmount() {
    if (this.streamDialog) {
      this.streamDialog.dismiss();
    }
  }

  reloadState = () => {
    Promise.all([DataSource.query(), DataSource.types(), Stream.query()])
      .then((values) => {
        let [dataSources, dataSourceTypes, streams] = values;
        annotateWithStreams(dataSources, streams);
        this.setState(
          { dataSources, dataSourceTypes, streams, loading: false },
          () => { /* ... */ }
        )
      })
      .catch((error) => this.props.onError?.(error));
  }

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
      navigateTo("streams", true);
    });

    this.streamDialog = dialog;
  }

  render() {
    const allowCreation = policy.isCreateDataSourceEnabled();

    return (
      <Space direction="vertical">
        <Breadcrumb
          items={[
            {
              title: "Home",
              href: "/",
            },
            {
              title: "Streams",
            },
          ]}
        />

        <Paragraph>
          Streams are the core of your data collection pipeline. Each stream corresponds to a
          table in your database, and ingest endpoint is generated for each stream.
          <br />Learn more in the <a>&ldquo;Documentation / Streams&rdquo;</a> chapter.
        </Paragraph>

        <Space>
          <Button
            type="primary"
            disabled={!allowCreation}
            onClick={
              allowCreation ? this.showCreateStreamDialog : undefined
            }
            >
              Create new stream
          </Button>
        </Space>

        {
          this.state.loading ? (
            <LoadingState className="" />
          ) : (
            this.state.dataSources.map((dataSource) =>
              <div
                key={`data-source-${dataSource.id}`}
              >
                <DatabaseTitleItem
                  item={dataSource}
                  title={{
                    level: 3,
                    style: {marginTop: ".5rem"}
                  }}
                />
                <StreamsList
                  items={dataSource.streams}
                />
              </div>
            )
          )
        }
      </Space>
    );
  }
}

routes.register(
  "Streams.List",
  routeWithUserSession({
    path: "/streams",
    title: "Streams",
    render: (pageProps) => (
      <StreamsPage {...pageProps} />
    ),
  })
);
