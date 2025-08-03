import { useRouter, useSearchParams } from "next/navigation";

export function useQueryParams(key: string, isUnique = false) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // 여러 태그 지원: tag=foo&tag=bar 형태
  const selectedQueryParams = searchParams.getAll(key);

  const handleClick = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (isUnique) {
      // 항상 하나만 남기기
      params.delete(key);
      params.append(key, value);
    } else {
      const isSelected = selectedQueryParams.includes(value);
      if (isSelected) {
        params.delete(key);
        selectedQueryParams
          .filter((t) => t !== value)
          .forEach((t) => params.append(key, t));
      } else {
        params.append(key, value);
      }
    }
    router.push(`?${params.toString()}`);
  };

  return { selectedQueryParams, handleClick };
}
