/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import type { AxiosRequestConfig } from "axios";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiRequestConfig<P = any>
  extends Partial<AxiosRequestConfig<P>> {
  useQueryRace?: boolean;
}

/** Minimal response contract — implementations may extend with extra fields. */
export interface ApiResponse<R, E = unknown> {
  data?: R;
  error?: E;
}

export interface CancelablePromise<T> extends Promise<T> {
  cancel: (message?: string) => void;
}

interface AxiosRequestParams<P = any> extends ApiRequestConfig<P> {
  type?: EContentType;
}

export type RequestParams = Omit<
  AxiosRequestParams,
  "data" | "method" | "params" | "url"
>;

export enum EContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

// ---------------------------------------------------------------------------
// HttpClient — pure data layer, no hidden logic
// ---------------------------------------------------------------------------

export abstract class HttpClient<E = unknown> {
  /** Implemented by ApiService — sends the actual request. */
  abstract instancePromise<R = any, P = any>(
    config: ApiRequestConfig<P>,
    options?: ApiRequestConfig<P>,
  ): CancelablePromise<ApiResponse<R, E>>;

  /** Called by generated Api methods. Prepares data and delegates to instancePromise. */
  protected request = <R = any, P = any>({
    type,
    data,
    ...options
  }: AxiosRequestParams<P>): CancelablePromise<ApiResponse<R, E>> => {
    if (type === EContentType.FormData && data && typeof data === "object") {
      data = this.createFormData(data as Record<string, unknown>) as P;
    }

    if (type === EContentType.Text && data && typeof data !== "string") {
      data = JSON.stringify(data) as P;
    }

    return this.instancePromise({
      ...options,
      headers: {
        ...(options.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      data,
    });
  };

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    }
    return `${formItem}`;
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }
}
