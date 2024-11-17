import React from "react";
import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "../App";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import UpdateStore from "../store/store";

const rootElement = document.getElementById("root");
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <HelmetProvider>
      <Suspense>
        <Provider store={UpdateStore}>
          <App />
        </Provider>
      </Suspense>
    </HelmetProvider>
  );
}
