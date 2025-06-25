import ky, { Options, Input } from "ky";

export enum HTTPMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

export class Fetcher {
  public instance = ky.create({
    prefixUrl: 'http://localhost:3000/api',
    timeout: 5_000,
    retry: 2,
  });

  public createCustomFetcher = (customOptions: Options) => {
    // enum 값을 문자열 배열로 꺼내서 순회
    return Object.values(HTTPMethod).reduce(
      (acc, method) => {
        acc[method] = <T,>(input: Input, options?: Options) =>
          this.instance[method]<T>(input, { ...options, ...customOptions, prefixUrl: 'http://localhost:3000/api' + customOptions.prefixUrl }).json();
        return acc;
      },
      {} as Record<
        HTTPMethod,
        <T>(input: Input, options?: Options) => Promise<T>
      >
    );
  };
}