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

// import DesktopOutlinedIcon from "@ant-design/icons/DesktopOutlined";
// import CodeOutlinedIcon from "@ant-design/icons/CodeOutlined";
// import AlertOutlinedIcon from "@ant-design/icons/AlertOutlined";
// import QuestionCircleOutlinedIcon from "@ant-design/icons/QuestionCircleOutlined";
// import SettingOutlinedIcon from "@ant-design/icons/SettingOutlined";

const DesktopOutlinedIcon2 = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-report"
      width="32" height="32" viewBox="0 0 24 24"
      strokeWidth="1.5" stroke="#ffffff" fill="none"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M8 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h5.697" />
      <path d="M18 14v4h4" />
      <path d="M18 11v-4a2 2 0 0 0 -2 -2h-2" />
      <rect x="8" y="3" width="6" height="4" rx="2" />
      <circle cx="18" cy="18" r="4" />
      <path d="M8 11h4" />
      <path d="M8 15h3" />
    </svg>
  )

//   return (
// <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chart-infographic" width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
//   <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
//   <circle cx="7" cy="7" r="4" />
//   <path d="M7 3v4h4" />
//   <line x1="9" y1="17" x2="9" y2="21" />
//   <line x1="17" y1="14" x2="17" y2="21" />
//   <line x1="13" y1="13" x2="13" y2="21" />
//   <line x1="21" y1="12" x2="21" y2="21" />
// </svg>
//   )

  // return (
  //   <svg xmlns="http://www.w3.org/2000/svg"
  //     className="icon icon-tabler icon-tabler-device-desktop-analytics"
  //     width="32" height="32" viewBox="0 0 24 24" strokeLinejoin="round"
  //     strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round"
  //   >
  //     <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
  //     <rect x="3" y="4" width="18" height="12" rx="1" />
  //     <path d="M7 20h10" />
  //     <path d="M9 16v4" />
  //     <path d="M15 16v4" />
  //     <path d="M9 12v-4" />
  //     <path d="M12 12v-1" />
  //     <path d="M15 12v-2" />
  //     <path d="M12 12v-1" />
  //   </svg>
  // )
}

const CodeOutlinedIcon2 = () => {
//   return (
// <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-code" width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
//   <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
//   <polyline points="7 8 3 12 7 16" />
//   <polyline points="17 8 21 12 17 16" />
//   <line x1="14" y1="4" x2="10" y2="20" />
// </svg>
//   )

//   return (    
// <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-terminal" width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
//   <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
//   <path d="M5 7l5 5l-5 5" />
//   <line x1="12" y1="19" x2="19" y2="19" />
// </svg>
//   )

  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-terminal-2"
      width="32" height="32" viewBox="0 0 24 24"
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

const SettingOutlinedIcon2 = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg"
      className="icon icon-tabler icon-tabler-settings"
      width="32" height="32" viewBox="0 0 24 24"
      strokeWidth="1.5" stroke="#ffffff" fill="none"
      strokeLinecap="round" strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

const AlertOutlinedIcon2 = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-alert-triangle" width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#ffffff" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
      <path d="M12 9v2m0 4v.01" />
      <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" />
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
            currentUser.hasPermission("view_query") &&
            getMenuItem(
              (<Link href="queries">Queries</Link>),
              "queries",
              <CodeOutlinedIcon2 aria-label="Queries navigation button" />
            )
          ),
          (
            currentUser.hasPermission("list_dashboards") &&
            getMenuItem(
              (<Link href="dashboards">Reports</Link>),
              "dashboards",
              <DesktopOutlinedIcon2 aria-label="Reports navigation button" />
            )
          ),
          (
            currentUser.hasPermission("list_alerts") &&
            getMenuItem(
              (<Link href="alerts">Alerts</Link>),
              "alerts",
              <AlertOutlinedIcon2 aria-label="Alerts navigation button" />
            )
          ),
          (
            firstSettingsTab && getMenuItem(
              (<Link href={firstSettingsTab.path}>Settings</Link>),
              "settings",
              <SettingOutlinedIcon2 aria-label="Settings navigation button" />
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
