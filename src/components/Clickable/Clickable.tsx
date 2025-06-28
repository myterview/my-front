import { neato } from "neato";
import {
  cloneElement,
  ComponentPropsWithoutRef,
  ElementType,
  isValidElement,
} from "react";

type ClickableProps = ClickableTypes & {
  className?: string;
  children: React.ReactNode;
};

type ClickableTypes = { types: "social" } | { types: "default" };

abstract class ClickableStrategy {
  abstract styleRender(): string;
}

class SocialClickableStrategy implements ClickableStrategy {
  styleRender(): string {
    return "flex items-center justify-start gap-15 rounded-10 p-15 shadow-custom rounded-[10] text-black/54 font-semibold";
  }
}

class DefaultClickableStrategy implements ClickableStrategy {
  styleRender(): string {
    return neato(
      "box-border flex items-center justify-center text-[16px] font-bold text-primary-500 bg-white border-primary-400 border-1 rounded-xl px-12 py-8",
      "@desktop/main:text-[20px] @desktop/main:px-16 @desktop/main:py-12",
      "active:bg-blue-500 active:border-blue-500 active:text-white hover:bg-blue-100"
    );
  }
}

class ClickableFactory {
  static create(type: ClickableProps["types"]): ClickableStrategy {
    switch (type) {
      case "default":
        return new DefaultClickableStrategy();
      case "social":
        return new SocialClickableStrategy();
      default:
        throw new Error("Unknown clickable type");
    }
  }
}

export function Clickable({
  types = "default",
  className,
  ...props
}: ClickableProps) {
  const strategy = ClickableFactory.create(types);

  return (
    <Slot {...props} className={neato(strategy.styleRender(), className)} />
  );
}

function Slot<T extends ElementType>({
  children,
  ...props
}: { children?: React.ReactNode } & ComponentPropsWithoutRef<T>) {
  if (!isValidElement(children)) {
    throw new Error("Slot 컴포넌트는 하나의 React 요소만 가져야 합니다.");
  }

  return cloneElement(children, props);
}
