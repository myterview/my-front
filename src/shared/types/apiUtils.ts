import { paths } from "./api";

type Roll<T> = { [K in keyof T]: T[K] } & {};

// /api prefix를 자동으로 추가하는 헬퍼 타입
type AddApiPrefix<T extends string> = `/api/${T}`;

// /api prefix가 있는 path만 추출
type ApiPaths = {
  [K in keyof paths as K extends `/api/${string}` ? K : never]: paths[K];
};

// /api prefix 없이 사용할 수 있는 path 타입
export type PathWithoutApi<T extends keyof ApiPaths> =
  T extends `/api/${infer Rest}` ? Rest : never;

// 개선된 ApiResponse - /api prefix 자동 추가
export type ApiResponse<
  T extends PathWithoutApi<keyof ApiPaths>,
  M extends keyof ApiPaths[AddApiPrefix<T>],
> =
  // 200 응답
  ApiPaths[AddApiPrefix<T>][M] extends {
    responses: { 200: { content: { "application/json": infer R200 } } };
  }
    ? R200
    : // 201 응답
      ApiPaths[AddApiPrefix<T>][M] extends {
          responses: { 201: { content: { "application/json": infer R201 } } };
        }
      ? R201
      : // 204 응답 (204는 보통 content가 없음)
        ApiPaths[AddApiPrefix<T>][M] extends {
            responses: { 204: { content: { "application/json": infer R204 } } };
          }
        ? R204
        : never;

// undefined 또는 never인 필드를 제거하는 유틸리티
type Clean<T> = {
  [K in keyof T as T[K] extends undefined | never ? never : K]: T[K];
};

// parameters에서 path, query 등 실제 값이 있는 필드만 추출
type ExtractParams<P> = P extends object ? Clean<P> : Record<string, never>;

// 특정 엔드포인트의 body, query, path 등 모든 요청 인자를 타입으로 추출
export type ApiRequestParams<
  T extends PathWithoutApi<keyof ApiPaths>,
  M extends keyof ApiPaths[AddApiPrefix<T>],
> = ExtractParams<
  Roll<
    ApiPaths[AddApiPrefix<T>][M] extends { parameters: infer P }
      ? P
      : Record<string, never>
  > &
    (ApiPaths[AddApiPrefix<T>][M] extends {
      requestBody: { content: { "application/json": infer B } };
    }
      ? { body: B }
      : Record<string, never>)
>;
