import React, { useMemo } from "react";
import { first, includes } from "@lodash";
import Menu from "antd/lib/menu";
import Link from "@/components/general/Link";
import PlainButton from "@/components/general/PlainButton";
import VersionInfo from "@/components/general/VersionInfo";
import HelpTrigger from "@/components/help/HelpTrigger";
import { useCurrentRoute } from "@/components/router/Router";
import { Auth, currentUser } from "@/services/auth";
import settingsMenu from "@/services/settingsMenu";
import logoUrl from "@/assets/images/icon-80.png";

import DesktopOutlinedIcon from "@ant-design/icons/DesktopOutlined";
import CodeOutlinedIcon from "@ant-design/icons/CodeOutlined";
import AlertOutlinedIcon from "@ant-design/icons/AlertOutlined";
import QuestionCircleOutlinedIcon from "@ant-design/icons/QuestionCircleOutlined";
import SettingOutlinedIcon from "@ant-design/icons/SettingOutlined";

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

/** 
 * @param {string | JSX.Element} label
 * @param {string | JSX.Element} icon
 */
function getMenuItem(label, key = '', icon = '', disabled = false) {
  return { key, icon, label, disabled };
}

export default function DesktopNavbar() {
  const firstSettingsTab = first(settingsMenu.getAvailableItems());
  const activeState = useNavbarActiveState();

  // const onClick = (/** @type {any} */ e) => {
  //   console.log('click ', e);
  // };
  // console.log('activeState', activeState)

  return (
    <nav className="desktop-navbar">
      <Menu selectable={false} theme="dark" mode="vertical" className="desktop-navbar-logo"
        items={[
          getMenuItem(
            (
              <Link href="./">
                <img src={logoUrl} alt="Redash" />
              </Link>
            ), "home", ""
          )
        ]}
      />

      <Menu selectable={true} mode="vertical" theme="dark"
        items={[
          (
            currentUser.hasPermission("list_dashboards") &&
            getMenuItem(
              (<Link href="dashboards">Dashboards</Link>),
              "dashboards",
              <DesktopOutlinedIcon aria-label="Dashboard navigation button" />
            )
          ),
          (
            currentUser.hasPermission("view_query") &&
            getMenuItem(
              (<Link href="queries">Queries</Link>),
              "queries",
              <CodeOutlinedIcon aria-label="Queries navigation button" />
            )
          ),
          (
            currentUser.hasPermission("list_alerts") &&
            getMenuItem(
              (<Link href="alerts">Alerts</Link>),
              "alerts",
              <AlertOutlinedIcon aria-label="Alerts navigation button" />
            )
          ),
          (
            firstSettingsTab && getMenuItem(
              (<Link href={firstSettingsTab.path}>Settings</Link>),
              "settings",
              <SettingOutlinedIcon aria-label="Settings navigation button" />
            )
          )
        ].filter(Boolean)}
      />

      <Menu selectable={false} mode="vertical" theme="dark" className="desktop-navbar-profile-menu"
        items={[
          // { type: 'divider' },
          {
            label: (
              <span className="desktop-navbar-profile-menu-title">
                <img className="profile__image_thumb"
                  src={currentUser.profile_image_url} alt={currentUser.name}
                />
              </span>
            ),
            popupClassName: "desktop-navbar-submenu",
            children: [
              getMenuItem(
                (<Link href="users/me">Profile</Link>),
                "profile",
                ""
              ),
              (
                currentUser.hasPermission("super_admin") &&
                getMenuItem(
                  (<Link href="admin/status">System Status</Link>),
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
                (<VersionInfo />),
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
