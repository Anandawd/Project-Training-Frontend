import axios from "axios";

declare module "axios" {
  interface AxiosResponse<T = any, D = any> {
    data: T;
    status: number;
    status2?: any;
    statusText: string;
    headers: AxiosResponseHeaders;
    config: AxiosRequestConfig<D>;
    request?: any;
  }
}
