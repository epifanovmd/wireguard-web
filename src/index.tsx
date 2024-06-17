import Cookie from "js-cookie";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { initLocalization } from "./localization";
import { ThemeProvider } from "./theme";

initLocalization({ initLang: Cookie.get("i18next") }).finally();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
);
