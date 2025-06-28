// value(한글) → key(영문)
export function getEnumKeyByValue<T extends Record<string, string>>(
  enumObj: T,
  value: string
): keyof T | undefined {
  return (Object.keys(enumObj) as Array<keyof T>).find(
    (key) => enumObj[key] === value
  );
}

// key(영문) → value(한글)
export function getEnumValueByKey<T extends Record<string, string>>(
  enumObj: T,
  key: string
): string | undefined {
  return enumObj[key as keyof T];
}
