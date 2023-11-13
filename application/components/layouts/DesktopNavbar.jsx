import React, { useMemo } from "react";
import { first, includes } from "@lodash";
import { Typography } from "antd";
import Menu from "antd/lib/menu";
import Link from "@/components/general/Link";
import PlainButton from "@/components/general/PlainButton";
import VersionInfo from "@/components/general/VersionInfo";
// import HelpTrigger from "@/components/help/HelpTrigger";
import { useCurrentRoute } from "@/components/router/Router";
import { Auth, currentUser } from "@/services/auth";
import settingsMenu from "@/services/settingsMenu";
import logoUrl from "@/assets/images/icon-80.png";

// const { Text } = Typography;

const ReportOutlinedIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-report"
      width="24" height="24" viewBox="0 0 24 24"
      strokeWidth="1.5" stroke="#ffffff" fill="none"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path d="M3 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
      <path d="M9 8m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
      <path d="M15 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z"></path>
      <path d="M4 20l14 0"></path>
    </svg>
  )
}

const TerminalOutlinedIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-terminal-2"
      width="24" height="24" viewBox="0 0 24 24"
      strokeWidth="1.5" stroke="#ffffff" fill="none"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M8 9l3 3l-3 3" />
      <line x1="13" y1="15" x2="16" y2="15" />
      <rect x="3" y="4" width="18" height="16" rx="2" />
    </svg>
  )
}

const SettingOutlinedIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-settings"
      width="24" height="24" viewBox="0 0 24 24"
      strokeWidth="1.5" stroke="#ffffff" fill="none"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

const TransferInOutlinedIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-transfer-in"
      width="24" height="24" viewBox="0 0 24 24"
      strokeWidth="1.5" stroke="#ffffff" fill="none"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M4 18v3h16v-14l-8 -4l-8 4v3"></path>
      <path d="M4 14h9"></path>
      <path d="M10 11l3 3l-3 3"></path>
    </svg>
  )
}

const HelpOutlinedIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-help"
      width="24" height="24" viewBox="0 0 24 24"
      strokeWidth="1.5" stroke="#ffffff" fill="none"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
      <path d="M12 17l0 .01"></path>
      <path d="M12 13.5a1.5 1.5 0 0 1 1 -1.5a2.6 2.6 0 1 0 -3 -4"></path>
    </svg>
  )
}

function useNavbarActiveState() {
  const currentRoute = useCurrentRoute();
  return useMemo(
    () => ({
      dashboards: includes(
        [
          "Dashboards.List",
          "Dashboards.Favorites",
          "Dashboards.My",
          "Dashboards.ViewOrEdit",
          "Dashboards.LegacyViewOrEdit",
        ],
        currentRoute.id
      ),
      queries: includes(
        [
          "Queries.List",
          "Queries.Favorites",
          "Queries.Archived",
          "Queries.My",
          "Queries.View",
          "Queries.New",
          "Queries.Edit",
        ],
        currentRoute.id
      ),
      alerts: includes(
        [
          "Alerts.List",
          "Alerts.New",
          "Alerts.View",
          "Alerts.Edit"
        ],
        currentRoute.id
      ),
      dataSources: includes(
        ["DataSources.List"],
        currentRoute.id
      ),
      settings: includes(
        ["DataSources.List"],
        currentRoute.id
      ),
    }),
    [currentRoute.id]
  );
}

export default function DesktopNavbar() {
  const firstSettingsTab = first(settingsMenu.getAvailableItems());
  // const activeState = useNavbarActiveState();

  /** 
   * @param {string | JSX.Element} label
   * @param {string | JSX.Element} icon
   */
  function getMenuItem(label, key = '', icon = '', disabled = false) {
    return { key, icon, label, disabled };
  }

  return (
    <nav className="desktop-navbar">
      <Menu selectable={true} className="desktop-navbar-main-menu"
        mode="vertical"
        theme="dark"
        items={[
          {
            key: "home",
            label: (
              <Link href="./">
                <img src={logoUrl} alt="Dingolytics" />
              </Link>
            ),
            title: "Home",
            disabled: true
          },
          (
            getMenuItem(
              <Link href="streams">Streams</Link>,
              "streams",
              <TransferInOutlinedIcon aria-label="Streams navigation button" />
            )
          ),
          // (
          //   getMenuItem(
          //     <Link href="data">Data</Link>,
          //     "data",
          //     <DatabaseOutlinedIcon aria-label="Data navigation button" />
          //   )
          // ),
          (
            // currentUser.hasPermission("view_query") &&
            getMenuItem(
              <Link href="queries">Queries</Link>,
              "queries",
              <TerminalOutlinedIcon aria-label="Queries navigation button" />
            )
          ),
          (
            // currentUser.hasPermission("list_dashboards") &&
            getMenuItem(
              (<Link href="widgets">Widgets</Link>),
              "widgets",
              <ReportOutlinedIcon aria-label="Widgets navigation button" />
            )
          ),
          (
            firstSettingsTab && getMenuItem(
              <Link href={firstSettingsTab.path}>Settings</Link>,
              "settings",
              <SettingOutlinedIcon aria-label="Settings navigation button" />
            )
          ),
          (
            getMenuItem(
              (<Link href="help">Help</Link>),
              "help",
              <HelpOutlinedIcon aria-label="Help navigation button" />
            )
          ),
        ].filter(Boolean)}
      />

      <Menu selectable={false} mode="vertical" theme="dark"
        className="desktop-navbar-profile-menu"
        items={[
          {
            key: "profile",
            label: (
              <Link>
                {currentUser.name}
              </Link>
            ),
            icon: null,
            popupClassName: "desktop-navbar-submenu",
            children: [
              getMenuItem(
                <Link href="users/me">Profile</Link>,
                "profile",
                ""
              ),
              (
                currentUser.hasPermission("super_admin") &&
                getMenuItem(
                  <Link href="admin/status">System Status</Link>,
                  "status",
                  ""
                )
              ),
              { type: 'divider' },
              getMenuItem(
                (
                  <PlainButton onClick={() => Auth.logout()}>
                    Log out
                  </PlainButton>
                ),
                "logout",
                ""
              ),
              { type: 'divider' },
              getMenuItem(
                <VersionInfo />,
                "version",
                "",
                true
              ),
            ].filter(Boolean)
          }
        ].filter(Boolean)}
      />
    </nav>
  );
}
