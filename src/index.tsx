import Cookie from "js-cookie";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";
import { initLocalization } from "./localization";
import { ThemeProvider } from "./theme";

const lang = localStorage.getItem("i18nextLng");

initLocalization({ initLang: lang ?? undefined }).finally();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </BrowserRouter>,
);
