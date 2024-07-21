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
import {
  EndpointsOutlinedIcon,
  TerminalOutlinedIcon,
  SettingOutlinedIcon,
  TransferInOutlinedIcon,
  HelpOutlinedIcon,
  WorkbooksOutlinedIcon
} from "@/theme/icons";
import logoUrl from "@/assets/images/icon-80.png";

// const { Text } = Typography;

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
              <Link href="streams">Data streams</Link>,
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
              <WorkbooksOutlinedIcon aria-label="Queries navigation button" />
            )
          ),
          (
            // currentUser.hasPermission("list_dashboards") &&
            getMenuItem(
              (<Link href="widgets">Endpoints</Link>),
              "widgets",
              <EndpointsOutlinedIcon aria-label="Widgets navigation button" />
            )
          ),
          {
            type: "divider"
          },
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
