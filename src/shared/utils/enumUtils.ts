import {
  EvaluationKeysKr,
  FeedbackTypeKr,
  GradedScore,
  InterviewExperienceKr,
  InterviewPositionKr,
  ProgressStatus,
} from "@/types";

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
export function getEnumKeyByValue(value: string): string {
  const enumObj = getEnumByValue(value); // Validate the value against known enums

  return (Object.keys(enumObj) as Array<keyof typeof enumObj>).find(
    (key) => enumObj[key] === value
  )!;
}

// key(영문) → value(한글)
export function getEnumValueByKey(key: string): string {
  const enumObj = getEnumByKey(key); // Validate the key against known enums
  return enumObj[key as keyof typeof enumObj];
}
