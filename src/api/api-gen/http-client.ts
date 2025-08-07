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

import {
  ApiRequestConfig,
  ApiResponse,
  ApiService,
  CancelablePromise,
} from "@force-dev/utils";
import type { AxiosError } from "axios";

interface AxiosRequestParams<P = any> extends ApiRequestConfig<P> {
  /** content type of request body */
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

export class HttpClient<
  E extends Error | AxiosError<EBody> = AxiosError<unknown>,
  EBody = unknown,
> extends ApiService<E, EBody> {
  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
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

  protected request = <R = any, P = any>({
    type,
    data,
    ...options
  }: AxiosRequestParams<P>): CancelablePromise<ApiResponse<R, E, EBody>> => {
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
}
