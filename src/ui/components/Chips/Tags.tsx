import { useComponentSize } from "@/shared/utils/useComponentSize";
import { ClassValue, neato } from "neato";
import { useLayoutEffect, useRef, useState } from "react";

export function Tags({
  each,
  className,
}: {
  each: Array<string>;
  className?: ClassValue;
}) {
  const tagRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const plusRef = useRef<HTMLSpanElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(each.length);
  const [containerRef, size] = useComponentSize<HTMLDivElement>();

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    let total = 0;
    let count = 0;

    for (let i = 0; i < each.length; i++) {
      const tagEl = tagRefs.current[i];
      if (!tagEl) continue;

      // +N 버튼이 필요한 상황이면 마지막 태그 대신 +N의 width 고려
      if (i === count && count < each.length - 1 && plusRef.current) {
        if (total + plusRef.current.offsetWidth > containerWidth) break;
      }

      total += tagEl.offsetWidth + 8; // gap-8
      if (total > containerWidth) break;
      count++;
    }

    // +N이 보이는 경우, +N이 컨테이너를 넘기면 한 개 덜 보여줌
    if (count < each.length && plusRef.current) {
      const plusRight = plusRef.current.getBoundingClientRect().right;
      const containerRight = containerRef.current.getBoundingClientRect().right;
      if (plusRight > containerRight && count > 0) {
        count--;
      }
    }

    setVisibleCount(count);
  }, [each, size.width, containerRef]);

  const hiddenCount = each.length - visibleCount;

  return (
    <div ref={containerRef} className={neato("flex gap-8  flex-1", className)}>
      {each.map((tag, i) => (
        <span
          key={tag}
          ref={(el) => {
            tagRefs.current[i] = el;
          }}
          className={`shadow-custom flex items-center justify-center whitespace-nowrap rounded-[4px] px-4 text-xs/18 font-medium text-primary-600 transition-all duration-100 ${
            i < visibleCount ? "" : "invisible absolute"
          }`}
        >
          #{tag}
        </span>
      ))}

      {hiddenCount > 0 && (
        <span
          ref={plusRef}
          className="shadow-custom flex items-center justify-center whitespace-nowrap rounded-[4px] px-4 text-xs/18 font-medium text-primary-600"
        >
          +{hiddenCount}
        </span>
      )}
    </div>
  );
}
