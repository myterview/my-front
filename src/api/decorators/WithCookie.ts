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
      // 쿠키 가져오기 (next/headers의 cookies는 동기 함수)
      const cookieStore = await cookies();
      const allCookies = cookieStore.getAll();
      const Cookie = allCookies
        .map(({ name, value }) => `${name}=${value}`)
        .join("; ");

      // this.serverFetcher의 HTTP 메서드 오버라이드
      const self = this as {
        serverFetcher?: Record<
          string,
          (input: string, options?: Record<string, unknown>) => Promise<unknown>
        >;
      };
      const httpMethods = ["get", "post", "put", "patch", "delete"] as const;
      type Method = (typeof httpMethods)[number];
      const originalFetcherMethods: Partial<
        Record<
          Method,
          (input: string, options?: Record<string, unknown>) => Promise<unknown>
        >
      > = {};

      httpMethods.forEach((method) => {
        if (
          self.serverFetcher &&
          typeof self.serverFetcher[method] === "function"
        ) {
          originalFetcherMethods[method] = self.serverFetcher[method];
          self.serverFetcher[method] = function (
            input: string,
            options: Record<string, unknown> = {}
          ) {
            return originalFetcherMethods[method]!.call(this, input, {
              ...options,
              headers: {
                ...(options.headers || {}),
                Cookie,
              },
            });
          };
        }
      });

      try {
        return await originalMethod.apply(this, args);
      } finally {
        // 원래 메서드 복원
        httpMethods.forEach((method) => {
          if (originalFetcherMethods[method]) {
            self.serverFetcher![method] = originalFetcherMethods[method]!;
          }
        });
      }
    };

    return descriptor;
  };
}
