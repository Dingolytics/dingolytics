import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import "@/config";
import ApplicationArea from "@/components/router";
import offlineListener from "@/services/offline-listener";

function AppWithCallbackAfterRender() {
  useEffect(() => {
    offlineListener.init();
  });
  return <ApplicationArea />
}

const container = window.document.getElementById("application-root");
const root = createRoot(container!);
root.render(<AppWithCallbackAfterRender />);

// DEBUG >>>
// import ReactDOM from 'react-dom';
// import "@redash/vis";
// import { Application } from './Application';

// ReactDOM.render(
//   <Application />, document.getElementById('root')
// );
// <<< DEBUG