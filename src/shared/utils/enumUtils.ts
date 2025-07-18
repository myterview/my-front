import {
  EvaluationKeysKr,
  FeedbackTypeKr,
  GradedScore,
  InterviewExperienceKr,
  InterviewPositionKr,
  ProgressStatus,
} from "@/shared/types";

const enumArray = [
  InterviewPositionKr,
  InterviewExperienceKr,
  FeedbackTypeKr,
  ProgressStatus,
  GradedScore,
  EvaluationKeysKr,
];

function getEnumByValue(value: string) {
  for (const enumObj of enumArray) {
    if (Object.values(enumObj).includes(value as never)) {
      return enumObj;
    }
  }
  throw new Error(
    `Unknown enum type for value: ${value}. Please check the value or add a new enum type.`
  );
}

function getEnumByKey(key: string) {
  for (const enumObj of enumArray) {
    if (Object.keys(enumObj).includes(key)) {
      return enumObj;
    }
  }
  throw new Error(
    `Unknown enum type for key: ${key}. Please check the key or add a new enum type.`
  );
}

// value(한글) → key(영문)
export function getEnumKeyByValue(value: string): string;
export function getEnumKeyByValue<E extends Record<string, string>>(
  value: string,
  enumType: E
): keyof E;
export function getEnumKeyByValue<E extends Record<string, string>>(
  value: string,
  enumType?: E
): string | keyof E {
  if (enumType) {
    return Object.keys(enumType).find(
      (key) => enumType[key] === value
    ) as keyof E;
  }

  try {
    const enumObj = getEnumByValue(value);
    return (
      Object.keys(enumObj).find(
        (key) => (enumObj as Record<string, string>)[key] === value
      ) || ""
    );
  } catch {
    console.warn(`Could not find enum for value: ${value}`);
    return "";
  }
}

// key(영문) → value(한글)
export function getEnumValueByKey(key: string): string;
export function getEnumValueByKey<E extends Record<string, string>>(
  key: string,
  enumType: E
): E[keyof E];
export function getEnumValueByKey<E extends Record<string, string>>(
  key: string,
  enumType?: E
): string | E[keyof E] {
  if (enumType) {
    return enumType[key];
  }

  try {
    const enumObj = getEnumByKey(key);
    return (enumObj as Record<string, string>)[key];
  } catch {
    console.warn(`Could not find enum for key: ${key}`);
    return "";
  }
}
