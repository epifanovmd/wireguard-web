import "./styles/index.css";

import { setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";
import React from "react";
import ReactDOM from "react-dom/client";

import { App } from "./App";

setDefaultOptions({ locale: ru });

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
