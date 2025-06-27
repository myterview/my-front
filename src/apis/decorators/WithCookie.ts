import { cookies } from "next/headers";

export function WithCookies() {
  return function <T, Args extends unknown[]>(
    target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: Args) => Promise<T>>
  ): TypedPropertyDescriptor<(...args: Args) => Promise<T>> {
    const originalMethod = descriptor.value;
    if (!originalMethod) return descriptor;

    descriptor.value = async function (...args: Args): Promise<T> {
      // 쿠키 가져오기
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      const Cookie = allCookies
        .map(({ name, value }) => `${name}=${value}`)
        .join("; ");

      // 타입 정의
      interface ApiMethod {
        (url: string, options?: RequestOptions): Promise<unknown>;
      }

      interface RequestOptions {
        headers?: Record<string, string>;
        [key: string]: unknown;
      }

      interface UserFetcher {
        get?: ApiMethod;
        post?: ApiMethod;
        put?: ApiMethod;
        patch?: ApiMethod;
        delete?: ApiMethod;
        [key: string]: ApiMethod | undefined;
      }

      interface SelfType {
        userFetcher?: UserFetcher;
      }

      // 원본 메서드 참조를 저장 (타입 개선)
      const self = this as SelfType;

      // userFetcher의 원본 메서드들을 백업 (타입 개선)
      const originalFetcherMethods: Record<string, ApiMethod> = {};

      if (self.userFetcher) {
        ["get", "post", "put", "patch", "delete"].forEach((method) => {
          const methodFn = self.userFetcher?.[method];
          if (typeof methodFn === "function") {
            originalFetcherMethods[method] = methodFn;

            // API 호출 메서드를 오버라이드하여 쿠키 자동 추가
            self.userFetcher![method] = function (
              url: string,
              options: RequestOptions = {}
            ) {
              const newOptions: RequestOptions = { ...options };
              newOptions.headers = {
                ...(newOptions.headers || {}),
                Cookie,
              };
              return originalFetcherMethods[method].call(this, url, newOptions);
            };
          }
        });
      }

      try {
        // 원본 메서드 실행
        return await originalMethod.apply(this, args);
      } finally {
        // 메서드 실행 후 원래 메서드 복원
        if (self.userFetcher) {
          Object.keys(originalFetcherMethods).forEach((method) => {
            if (self.userFetcher) {
              self.userFetcher[method] = originalFetcherMethods[method];
            }
          });
        }
      }
    };

    return descriptor;
  };
}
