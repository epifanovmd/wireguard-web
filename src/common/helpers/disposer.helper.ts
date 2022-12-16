import { isArray, isFunction } from "./typeGuards.hekper";
import { InitializeDispose } from "./types";

export const disposer = (dispose: InitializeDispose | InitializeDispose[]) => {
  if (dispose instanceof Promise) {
    dispose
      .then(disposable => {
        if (isFunction(disposable)) {
          disposer(disposable);
        }

        if (isArray(disposable)) {
          disposable.forEach(disposer);
        }
      })
      .catch();
  }

  if (isArray(dispose)) {
    dispose.forEach(disposer);
  }

  if (isFunction(dispose)) {
    dispose();
  }
};
