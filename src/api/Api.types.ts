export type ApiRequest<T extends object = {}> = T & {
  skip?: number;
  limit?: number;
};

export interface ListResponse<T> {
  count?: number;
  offset?: number;
  limit?: number;
  data: T;
}
