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
      hooks: {
        beforeRequest: [
          (request) => {
            // 서버사이드에서 필요한 헤더 추가
            if (type === "server") {
              request.headers.set("User-Agent", "MyTerview-NextJS-Server/1.0");
              request.headers.set("Accept", "application/json");
              // X-Forwarded-For 헤더 추가 (로드밸런서 환경에서 필요할 수 있음)
              request.headers.set("X-Forwarded-Proto", "https");
            }
            console.log(`[${type}] Request to:`, request.url);
          },
        ],
        beforeError: [
          (error) => {
            console.error(
              `[${type}] Request failed:`,
              error.message,
              error.response?.status
            );
            return error;
          },
        ],
      },
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
