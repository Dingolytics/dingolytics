import React, { useRef, useCallback, CSSProperties } from "react";
import { Layout } from 'antd';

import DesktopNavbar from "@/components/layouts/DesktopNavbar";
import MobileNavbar from "@/components/layouts/MobileNavbar";

const { Sider, Content } = Layout;

const contentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  padding: '1rem',
  overflow: 'visible',
  minHeight: '100vh',
};

type ApplicationLayoutProps = {
  children: React.ReactNode;
}

const ApplicationLayout: React.FC<ApplicationLayoutProps> = ({ children }) => {
  const mobileNavbarContainerRef = useRef<any>();

  const getMobileNavbarPopupContainer = useCallback(
    () => mobileNavbarContainerRef.current, []
  );

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

export default ApplicationLayout;