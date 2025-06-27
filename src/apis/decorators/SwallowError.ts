export function SwallowError<T>(
  swallowedReturnValue: T = undefined as unknown as T
) {
  return function (
    target: unknown,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<(...args: unknown[]) => Promise<T>>
  ): void {
    const originalMethod = descriptor.value;

    if (!originalMethod) return;

    descriptor.value = async function (...args: unknown[]): Promise<T> {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error(`Error in method ${propertyKey} (swallowed):`, error);
        }
        return swallowedReturnValue;
      }
    };
  };
}
