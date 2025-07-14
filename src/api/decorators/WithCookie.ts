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

      // Fetcher 클래스의 fetcher 프로퍼티에 접근
      const self = this as {
        fetcher?: Record<
          string,
          (input: string, options?: Record<string, unknown>) => Promise<unknown>
        >;
      };

      const fetcher = self.fetcher;
      const httpMethods = ["get", "post", "put", "patch", "delete"] as const;
      type Method = (typeof httpMethods)[number];
      const originalFetcherMethods: Partial<
        Record<
          Method,
          (input: string, options?: Record<string, unknown>) => Promise<unknown>
        >
      > = {};

      if (fetcher) {
        // 원본 메서드들을 백업하고 쿠키 헤더를 추가하는 래퍼로 교체
        httpMethods.forEach((method) => {
          if (typeof fetcher[method] === "function") {
            originalFetcherMethods[method] = fetcher[method];
            fetcher[method] = function (
              input: string,
              options: Record<string, unknown> = {}
            ) {
              // options의 headers에 Cookie 추가
              const mergedOptions = {
                ...options,
                headers: {
                  ...(options.headers || {}),
                  Cookie,
                },
              };
              return originalFetcherMethods[method]!.call(
                this,
                input,
                mergedOptions
              );
            };
          }
        });
      }

      try {
        return await originalMethod.apply(this, args);
      } finally {
        // 원래 메서드 복원
        if (fetcher) {
          httpMethods.forEach((method) => {
            if (originalFetcherMethods[method]) {
              fetcher[method] = originalFetcherMethods[method]!;
            }
          });
        }
      }
    };

    return descriptor;
  };
}
