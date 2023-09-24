/** General */
import { Component } from "react";
import { Button, Space, Typography } from "antd";
const { Title } = Typography;

/** Components */
import CreateStreamDialog from "@/components/streams/CreateStreamDialog";
import LoadingState from "@/components/items-list/components/LoadingState";
import { GrouppedStreamsList} from "@/components/streams/StreamsList";
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

/** Component definition */
class StreamsList extends Component<StreamsPageProps, StreamsPageState> {
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
      <div>
        <Title level={4}>
          Data streams
        </Title>

        {
          this.state.loading ? (
            <LoadingState className="" />
          ) : (
            <GrouppedStreamsList
              items={this.state.dataSources}
            />
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

const StreamsListPage = StreamsList;

routes.register(
  "Streams.List",
  routeWithUserSession({
    path: "/streams",
    title: "Streams",
    render: (pageProps) => (
      <StreamsListPage {...pageProps} />
    ),
  })
);
