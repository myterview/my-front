import { ProgressStatus } from "@/shared/types";
import { ClassValue, neato } from "neato";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: ClassValue;
}) {
  return (
    <div
      className={neato("shadow-custom rounded-[4px] px-32 py-20", className)}
    >
      {children}
    </div>
  );
}

Card.Title = function Title({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: ClassValue;
}) {
  return (
    <h4
      className={neato(
        "line-clamp-1 text-2xl font-extrabold text-left break-keep",
        className
      )}
    >
      {children}
    </h4>
  );
};

Card.subTitle = function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="line-clamp-2 text-base/24 font-medium text-gray-600">
      {children}
    </p>
  );
};

Card.ProgressChip = function Progress({
  children,
}: {
  children: ProgressStatus;
}) {
  return (
    <div
      className={neato(
        "flex items-center justify-center rounded-[4px] px-4 text-xs/18 font-medium text-black",
        {
          "bg-secondary": children === ProgressStatus.IN_PROGRESS,
          "bg-gray-200": children === ProgressStatus.ANALYZING,
          "bg-primary-100": children === ProgressStatus.COMPLETED,
        }
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
