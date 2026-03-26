import { InitializeDispose } from "./types";

export const disposer = (dispose: InitializeDispose | InitializeDispose[]) => {
  if (dispose instanceof Promise) {
    dispose
      .then(disposable => {
        if (typeof disposable === "function") {
          disposer(disposable);
        }
        if (Array.isArray(disposable)) {
          disposable.forEach(disposer);
        }
      })
      .catch();
  }

  if (Array.isArray(dispose)) {
    dispose.forEach(disposer);
  }

  if (typeof dispose === "function") {
    dispose();
  }
};
