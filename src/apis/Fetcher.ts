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
      timeout: 30000, // 타임아웃 추가
      // retry: {
      //   limit: 2,
      //   methods: ["get", "post", "put", "patch", "delete"],
      //   statusCodes: [408, 413, 429, 500, 502, 503, 504],
      // },
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
            console.log(`[${type}] 🚀 Starting request:`, {
              method: request.method,
              url: request.url,
              headers: Object.fromEntries(request.headers.entries()),
              timestamp: new Date().toISOString(),
            });
          },
        ],
        afterResponse: [
          (request, options, response) => {
            console.log(`[${type}] ✅ Request successful:`, {
              method: request.method,
              url: request.url,
              status: response.status,
              statusText: response.statusText,
              timestamp: new Date().toISOString(),
            });
            return response;
          },
        ],
        beforeError: [
          (error) => {
            console.error(`[${type}] ❌ Request failed:`, {
              message: error.message,
              name: error.name,
              status: error.response?.status,
              statusText: error.response?.statusText,
              url: error.request?.url,
              method: error.request?.method,
              timestamp: new Date().toISOString(),
              stack: error.stack,
            });
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
