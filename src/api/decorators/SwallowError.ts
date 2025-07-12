/* eslint-disable @typescript-eslint/no-explicit-any */

export function SwallowError() {
  return function <T extends (...args: any[]) => any>(
    target: any,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value;

    descriptor.value = async function (this: any, ...args: Parameters<T>) {
      try {
        return await originalMethod?.apply(this, args);
      } catch (error) {
        // Handle error
        console.error(error);
        return null;
      }
    } as T;

    return descriptor;
  };
}
