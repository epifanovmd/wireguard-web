import { ApiAbortPromise } from "./Api.types";
import { BASE_URL } from "./axios";

export class ApiExtractAbort {
  public ref: { abort?: () => void } = {};

  public getPromiseAbort = <R extends any>(promise: ApiAbortPromise<R>) => {
    this.ref.abort = promise.abort;

    return promise;
  };
}

export const hostname = (BASE_URL ?? "").replace("api/", "") || "/";

export const toAbsoluteUrl = (url?: string) => {
  if (!url) {
    return undefined;
  }

  const regexp = new RegExp(/(http(s?)|file):\/\//);

  if (regexp.test(url) || url.includes("://")) {
    return url;
  }

  return `${hostname}${url}`.replace("///", "//");
};
