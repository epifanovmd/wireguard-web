import { ApiAbortPromise } from "./Api.types";

export class ApiExtractAbort {
  public ref: { abort?: () => void } = {};

  public getPromiseAbort = <R extends any>(promise: ApiAbortPromise<R>) => {
    this.ref.abort = promise.abort;

    return promise;
  };
}
