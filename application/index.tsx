import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';

import "@/config";
import ApplicationArea from "@/components/router";
import offlineListener from "@/services/offline-listener";

function AppWithCallbackAfterRender() {
  useEffect(() => {
    offlineListener.init();
  });
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00b96b',
        },
        // algorithm: theme.darkAlgorithm,
      }}
    >
      <ApplicationArea />
    </ConfigProvider>
  )
}

const container = window.document.getElementById("application-root");

const root = createRoot(container!);

root.render(<AppWithCallbackAfterRender />);
