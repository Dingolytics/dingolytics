import React, { useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { Layout, Space } from 'antd';

// import DynamicComponent from "@/components/general/DynamicComponent";
import DesktopNavbar from "@/components/layouts/DesktopNavbar";
import MobileNavbar from "@/components/layouts/MobileNavbar";

const { Sider, Content } = Layout;

const contentStyle = {
  padding: '1rem',
  overflow: 'visible',
};

export default function ApplicationLayout({ children }) {
  const mobileNavbarContainerRef = useRef();

  const getMobileNavbarPopupContainer = useCallback(() => mobileNavbarContainerRef.current, []);

  return (
    <Layout>
      <Sider className="application-layout-side-menu">
        <DesktopNavbar />
      </Sider>
      <Content style={contentStyle}>
        <nav className="application-layout-top-menu"
          ref={mobileNavbarContainerRef}
        >
          <MobileNavbar getPopupContainer={getMobileNavbarPopupContainer} />
        </nav>
        {children}
      </Content>
    </Layout>
  );
}

ApplicationLayout.propTypes = {
  children: PropTypes.node,
};

ApplicationLayout.defaultProps = {
  children: null,
};
