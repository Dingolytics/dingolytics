// import { includes } from "@lodash";
import { useEffect } from "react";

// import Alert from "antd/lib/alert";
// import Link from "@/components/general/Link";
import routeWithUserSession from "@/components/router/routeWithUserSession";
// import EmptyState, { EmptyStateHelpMessage } from "@/components/empty-state/EmptyState";
// import DynamicComponent from "@/components/general/DynamicComponent";
// import PlainButton from "@/components/general/PlainButton";
import navigateTo from "@/components/router/navigateTo";

// import { axios } from "@/services/axios";
// import recordEvent from "@/services/recordEvent";
// import { messages } from "@/services/auth";
// import notification from "@/services/notification";
import routes from "@/services/routes";

// import { DashboardAndQueryFavoritesList } from "./components/FavoritesList";

import "./Home.less";

/*
function DeprecatedEmbedFeatureAlert() {
  return (
    <Alert
      className="m-b-15"
      type="warning"
      message={
        <>
          You have enabled <code>ALLOW_PARAMETERS_IN_EMBEDS</code>. This setting is now deprecated and should be turned
          off. Parameters in embeds are supported by default.{" "}
          <Link
            href="https://discuss.redash.io/t/support-for-parameters-in-embedded-visualizations/3337"
            target="_blank"
            rel="noopener noreferrer">
            Read more
          </Link>
          .
        </>
      }
    />
  );
}

function EmailNotVerifiedAlert() {
  const verifyEmail = () => {
    axios.post("verification_email/").then(data => {
      notification.success(data.message);
    });
  };

  return (
    <Alert
      className="m-b-15"
      type="warning"
      message={
        <>
          We have sent an email with a confirmation link to your email address. Please follow the link to verify your
          email address.{" "}
          <PlainButton type="link" onClick={verifyEmail}>
            Resend email
          </PlainButton>
          .
        </>
      }
    />
  );
}

export default function Home() {
  useEffect(() => {
    recordEvent("view", "page", "personal_homepage");
  }, []);

  return (
    <div className="home-page">
      <div className="container">
        {includes(messages, "using-deprecated-embed-feature") && <DeprecatedEmbedFeatureAlert />}
        {includes(messages, "email-not-verified") && <EmailNotVerifiedAlert />}
        <DynamicComponent name="Home.EmptyState">
          <EmptyState
            header="Welcome to Redash 👋"
            description="Connect to any data source, easily visualize and share your data"
            illustration="dashboard"
            helpMessage={<EmptyStateHelpMessage helpTriggerType="GETTING_STARTED" />}
            showDashboardStep
            showInviteStep
            onboardingMode
          />
        </DynamicComponent>
        <DynamicComponent name="HomeExtra" />
        <DashboardAndQueryFavoritesList />
      </div>
    </div>
  );
}
*/

export default function HomeRedirect() {
  useEffect(() => {
    navigateTo("streams");
  }, []);
  return null;
}

routes.register(
  "Home",
  routeWithUserSession({
    path: "/",
    title: "Home",
    render: (pageProps) => <HomeRedirect {...pageProps} />,
  })
);
