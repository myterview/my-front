import { paths } from "@/types/api";
// ApiResponse 타입을 자동 추론하는 fetcher
import type { ApiResponse, PathWithoutApi } from "@/types/apiUtils";
import ky, { Options } from "ky";

export enum HTTPMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
}

export class Fetcher {
  public instance = (type: "server" | "client" = "server") =>
    ky.create({
      prefixUrl:
        type === "server"
          ? "https://myterview.com/api"
          : "https://myterview.com/api",
      // type === "server"
      //   ? process.env.NEXT_PUBLIC_SERVER_API_URL
      //   : process.env.NEXT_PUBLIC_CLIENT_API_URL,
    });

  public serverFetcher = this.createFetcher("server");
  public clientFetcher = this.createFetcher("client");

  private createFetcher(type: "server" | "client") {
    return {
      get: <P extends PathWithoutApi<keyof paths>>(
        path: P,
        options?: Options
      ): Promise<ApiResponse<P, "get">> => {
        return this.instance(type).get(path, options).json();
      },
      post: <P extends PathWithoutApi<keyof paths>>(
        path: P,
        options?: Options
      ): Promise<ApiResponse<P, "post">> => {
        return this.instance(type).post(path, options).json();
      },
      put: <P extends PathWithoutApi<keyof paths>>(
        path: P,
        options?: Options
      ): Promise<ApiResponse<P, "put">> => {
        return this.instance(type).put(path, options).json();
      },
      patch: <P extends PathWithoutApi<keyof paths>>(
        path: P,
        options?: Options
      ): Promise<ApiResponse<P, "patch">> => {
        return this.instance(type).patch(path, options).json();
      },
      delete: <P extends PathWithoutApi<keyof paths>>(
        path: P,
        options?: Options
      ): Promise<ApiResponse<P, "delete">> => {
        return this.instance(type).delete(path, options).json();
      },
    };
  }
}
