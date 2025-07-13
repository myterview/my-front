import type {
  ApiRequestParams,
  ApiResponse,
  PathWithoutApi,
  paths,
} from "@/types";
import {
  type UseMutationOptions,
  infiniteQueryOptions,
  queryOptions,
} from "@tanstack/react-query";
import ky, { type Options } from "ky";

// React Query 유틸리티 함수들
const mutationOptions = <
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationOptions<TData, TError, TVariables, TContext> => options;

export { infiniteQueryOptions, mutationOptions, queryOptions };

// HTTP 메서드 정의
export enum HTTPMethod {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
}

// 타입 정의
type HttpMethod = Lowercase<keyof typeof HTTPMethod>;

type FetcherInstance = {
  [M in HttpMethod]: <P extends PathWithoutApi<keyof paths>>(
    ...args: ApiRequestParams<P, M> extends Record<string, never>
      ? [path: P, options?: Options]
      : [path: P, params: ApiRequestParams<P, M>, options?: Options]
  ) => Promise<ApiResponse<P, M>>;
};

type KyMethodSignature = (url: string, options?: Options) => Promise<Response>;

type Environment = "server" | "client";

/**
 * BaseHttpClient는 HTTP 요청의 핵심 로직을 담당하는 추상 클래스입니다.
 * 요청 파라미터 처리, 경로 파라미터 치환, API 요청 객체 변환 등의 공통 기능을 제공하며,
 * 실제 HTTP 클라이언트 생성은 하위 클래스에서 구현하도록 설계되었습니다.
 * 이를 통해 HTTP 요청 처리의 일관성을 보장하면서도 다양한 환경별 설정을 유연하게 지원합니다.
 */
abstract class BaseHttpClient {
  protected abstract createKyInstance(
    environment: Environment
  ): ReturnType<typeof ky.create>;

  /**
   * 요청 파라미터를 처리하여 최종 경로와 옵션을 반환합니다.
   */
  protected processRequestParams(
    path: string,
    paramsOrOptions?: Record<string, unknown> | Options,
    additionalOptions?: Options
  ): { finalPath: string; finalOptions: Options } {
    let finalPath = path;
    let finalOptions: Options = {};

    if (this.isApiRequestParams(paramsOrOptions)) {
      // ApiRequestParams의 각 속성을 ky options로 변환
      finalPath = this.processPathParams(
        path,
        paramsOrOptions.path as Record<string, string>
      );
      finalOptions = this.buildKyOptions(paramsOrOptions);

      // 추가 options 병합
      if (additionalOptions) {
        finalOptions = { ...finalOptions, ...additionalOptions };
      }
    } else {
      // paramsOrOptions가 Options인 경우
      finalOptions = paramsOrOptions || {};
    }

    return { finalPath, finalOptions };
  }

  /**
   * 객체가 ApiRequestParams인지 확인합니다.
   */
  protected isApiRequestParams(obj: unknown): obj is Record<string, unknown> {
    return (
      obj !== null &&
      typeof obj === "object" &&
      ("body" in obj || "query" in obj || "path" in obj || "header" in obj)
    );
  }

  /**
   * path 파라미터를 URL에 치환합니다.
   */
  protected processPathParams(
    path: string,
    pathParams?: Record<string, string>
  ): string {
    if (!pathParams) return path;

    let finalPath = path;
    Object.entries(pathParams).forEach(([key, value]) => {
      finalPath = finalPath.replace(`{${key}}`, value);
    });
    return finalPath;
  }

  /**
   * ApiRequestParams를 ky Options로 변환합니다.
   */
  protected buildKyOptions(params: Record<string, unknown>): Options {
    const options: Options = {};

    if (params.body) {
      options.json = params.body;
    }

    if (params.query) {
      options.searchParams = params.query as Record<string, string>;
    }

    if (params.header) {
      options.headers = params.header as Record<string, string>;
    }

    return options;
  }
}

/**
 * Fetcher는 OpenAPI 스펙을 기반으로 한 타입 안전한 HTTP 클라이언트 구현체입니다.
 * BaseHttpClient를 상속받아 서버와 클라이언트 환경별로 최적화된 HTTP 인스턴스를 생성하고,
 * 각 HTTP 메서드에 대해 OpenAPI 타입 정의와 연동된 자동 타입 추론 기능을 제공합니다.
 * 이를 통해 컴파일 타임에 API 경로와 파라미터의 유효성을 검증하고, 런타임 오류를 사전에 방지할 수 있습니다.
 */
export class Fetcher extends BaseHttpClient {
  public onServer = this.createFetcher("server");
  public onClient = this.createFetcher("client");
  protected queryOptions = queryOptions;
  protected infiniteQueryOptions = infiniteQueryOptions;
  protected mutationOptions = <
    TData = unknown,
    TError = Error,
    TVariables = void,
    TContext = unknown,
  >(
    options: UseMutationOptions<TData, TError, TVariables, TContext>
  ): UseMutationOptions<TData, TError, TVariables, TContext> => options;

  protected createKyInstance(environment: Environment) {
    switch (environment) {
      case "server":
        return ky.create({
          prefixUrl: process.env.NEXT_PUBLIC_SERVER_API_URL,
        });
      case "client":
        return ky.create({
          prefixUrl: process.env.NEXT_PUBLIC_CLIENT_API_URL,
        });
      default:
        throw new Error(`Unknown environment: ${environment}`);
    }
  }

  private createFetcher(environment: Environment): FetcherInstance {
    const kyInstance = this.createKyInstance(environment);
    const fetcher = {} as FetcherInstance;

    // HTTP 메서드별 fetcher 함수 생성
    (Object.values(HTTPMethod) as HttpMethod[]).forEach((method) => {
      fetcher[method] = async <P extends PathWithoutApi<keyof paths>>(
        path: P,
        paramsOrOptions?: ApiRequestParams<P, typeof method> | Options,
        options?: Options
      ) => {
        const { finalPath, finalOptions } = this.processRequestParams(
          path as string,
          paramsOrOptions,
          options
        );

        const kyMethod = kyInstance[method] as KyMethodSignature;
        const response = await kyMethod.call(
          kyInstance,
          finalPath,
          finalOptions
        );
        return response.json();
      };
    });

    return fetcher;
  }
}
