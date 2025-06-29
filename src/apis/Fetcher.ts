import ky, { Options } from "ky";

export enum HTTPMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
}

// ApiResponse 타입을 자동 추론하는 fetcher
import type { ApiResponse, PathWithoutApi } from "@/types/apiUtils";
import { paths } from "@/types/api";

export class Fetcher {
  public instance = (type: "server" | "client" = "server") =>
    ky.create({
      prefixUrl:
        type === "server"
          ? process.env.NEXT_PUBLIC_SERVER_API_URL
          : process.env.NEXT_PUBLIC_CLIENT_API_URL,
      timeout: 5_000,
      retry: 2,
    });

  public serverFetcher = {
    get: <P extends PathWithoutApi<keyof paths>>(
      path: P,
      options?: Options
    ): Promise<ApiResponse<P, "get">> => {
      return this.instance().get(path, options).json();
    },
    post: <P extends PathWithoutApi<keyof paths>>(
      path: P,
      options?: Options
    ): Promise<ApiResponse<P, "post">> => {
      return this.instance().post(path, options).json();
    },
    put: <P extends PathWithoutApi<keyof paths>>(
      path: P,
      options?: Options
    ): Promise<ApiResponse<P, "put">> => {
      return this.instance().put(path, options).json();
    },
    patch: <P extends PathWithoutApi<keyof paths>>(
      path: P,
      options?: Options
    ): Promise<ApiResponse<P, "patch">> => {
      return this.instance().patch(path, options).json();
    },
    delete: <P extends PathWithoutApi<keyof paths>>(
      path: P,
      options?: Options
    ): Promise<ApiResponse<P, "delete">> => {
      return this.instance().delete(path, options).json();
    },
  };
}
