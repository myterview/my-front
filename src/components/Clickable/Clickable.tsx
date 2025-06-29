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

type ClickableTypes = ShadowClickableTypes | DefaultClickableTypes;

type ShadowClickableTypes = {
  types: "shadow";
  size: "small" | "medium" | "large";
};

type DefaultClickableTypes = {
  types: "default";
};

abstract class ClickableStrategy {
  abstract styleRender(): string;
}

class ShadowClickableStrategy implements ClickableStrategy {
  constructor(private props: ShadowClickableTypes) {}

  styleRender(): string {
    return neato(
      "flex items-center justify-start shadow-custom bg-white font-semibold",
      this.props.size === "small" && "p-4 rounded-[12]",
      this.props.size === "large" && "gap-15 rounded-[10] p-15 text-black/54"
    );
  }
}

class DefaultClickableStrategy implements ClickableStrategy {
  styleRender(): string {
    return neato(
      "box-border flex items-center justify-center text-base font-bold text-primary-500 bg-white border-primary-400 border-1 rounded-xl px-12 py-8",
      "@desktop/main:text-xl @desktop/main:px-16 @desktop/main:py-12",
      "active:bg-blue-500 active:border-blue-500 active:text-white hover:bg-blue-100",
      "disabled:bg-black"
    );
  }
}

class ClickableFactory {
  static create(props: ClickableTypes): ClickableStrategy {
    switch (props.types) {
      case "shadow":
        return new ShadowClickableStrategy(props);
      default:
        return new DefaultClickableStrategy();
    }
  }
}

export function Clickable({
  types = "default",
  className,
  children,
  ...props
}: ClickableProps) {
  const strategy = ClickableFactory.create({
    types,
    ...props,
  } as ClickableTypes);

  return (
    <Slot {...props} className={neato(strategy.styleRender(), className)}>
      {children}
    </Slot>
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
