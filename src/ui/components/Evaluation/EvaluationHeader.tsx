import { Card } from "../Card/Card";
import Image from "next/image";

export function EvaluationHeader({
  onClose,
  title,
  createdAt,
  tags,
  className = "",
}: {
  onClose: () => void;
  title: string;
  createdAt: string;
  tags: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="flex items-start justify-between gap-24">
        <Card.Title>{title}</Card.Title>

        <button type="button" onClick={onClose}>
          <Image
            src="/icons/close.svg"
            alt="close"
            draggable="false"
            width={24}
            height={24}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <Card.subTitle>{createdAt}</Card.subTitle>
        <Card.Tags each={tags} />
      </div>
    </div>
  );
}
