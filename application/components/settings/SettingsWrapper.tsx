import React from "react";
import { Breadcrumb, Menu, Space, Tabs } from "antd";
import type { TabsProps } from "antd";
import PageHeader from "@/components/general/PageHeader";
import Link from "@/components/general/Link";
import navigateTo from "@/components/router/navigateTo";
import location from "@/services/location";
import settingsMenu from "@/services/settingsMenu";

function wrapSettingsTab(id, options, WrappedComponent) {
  settingsMenu.add(id, options);

  return function SettingsTab(props) {
    const activeItem = settingsMenu.getActiveItem(location.path);

    const menuItems = settingsMenu.getAvailableItems();

    const tabsItems: TabsProps["items"] = menuItems.map(item => {
      return {
        key: item.id,
        label: item.title,
        children: null,
      }
    });

    const breadcrumbItems = [
      {
        title: "Home",
        href: "/",
      },
      {
        title: "Settings",
      }
    ];

    const onTabChange = (key: string) => {
      let path = "";
      for (const item of menuItems) {
        if (key == item.id) {
          path = item.path;
          break;
        }
      }
      navigateTo(path);
    }

    return (
      <Space direction="vertical">
        <Breadcrumb items={breadcrumbItems}/>

        <div> 
          <Tabs items={tabsItems} onChange={onTabChange}
            type="card" animated={false}
            activeKey={activeItem.id}
          />

          <Space direction="vertical" style={{
            backgroundColor: "#ffffff",
            display: "flex",
            padding: "1rem",
          }}>
            <WrappedComponent {...props} />
          </Space>
        </div>
      </Space>
    );
  };
}

export default wrapSettingsTab;
