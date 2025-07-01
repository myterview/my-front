import { For } from "@ilokesto/utilinent";
import { neato } from "neato";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={neato("shadow-custom rounded-[4] px-32 py-20", className)}>
      {children}
    </div>
  );
}

Card.Title = function Title({ children }: { children: React.ReactNode }) {
  return <h4 className="line-clamp-1 text-2xl font-extrabold">{children}</h4>;
};

Card.subTitle = function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="line-clamp-2 text-base/24 font-medium text-gray-600">
      {children}
    </p>
  );
};

export enum ProgressStatus {
  IN_PROGRESS = "진행 중",
  ANALYZING = "분석 중",
  COMPLETED = "분석 완료",
}

Card.ProgressChip = function Progress({
  children,
}: {
  children: ProgressStatus;
}) {
  return (
    <div
      className={neato(
        "flex items-center justify-center rounded-[4] px-4 text-xs/18 font-medium text-black",
        children === ProgressStatus.IN_PROGRESS && "bg-secondary",
        children === ProgressStatus.ANALYZING && "bg-gray-200",
        children === ProgressStatus.COMPLETED && "bg-blue-100"
      )}
    >
      {children}
    </div>
  );
};

Card.Description = function Description({
  children,
}: {
  children: React.ReactNode;
}) {
  return <p className="text-xs/18 font-medium text-gray-600">{children}</p>;
};

Card.Tags = function Tags({ each }: { each: Array<string> }) {
  return (
    <div className="flex gap-8">
      <For each={each}>
        {(tag) => (
          <span
            key={tag}
            className="shadow-custom flex items-center justify-center rounded-[4] px-4 text-xs/18 font-medium text-blue-600"
          >
            #{tag}
          </span>
        )}
      </For>
    </div>
  );
};
