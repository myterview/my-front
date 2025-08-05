import { ClassValue, neato, neatoVariants } from "neato";
import {
  cloneElement,
  ComponentPropsWithoutRef,
  ElementType,
  isValidElement,
} from "react";

type ClickableProps = ClickableTypes & {
  className?: ClassValue;
  children: React.ReactNode;
};

type ClickableTypes =
  | ShadowClickableTypes
  | DefaultClickableTypes
  | SelectableClickableTypes;

type ShadowClickableTypes = {
  types: "shadow";
  size: "small" | "medium" | "large";
};

type DefaultClickableTypes = {
  types: "default";
};

type SelectableClickableTypes = {
  types: "selectable";
  "data-selected": boolean;
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
      "@lg/main:text-xl @lg/main:px-16 @lg/main:py-12",
      "active:bg-primary-500 active:border-primary-500 active:text-white hover:bg-primary-100",
      "disabled:bg-gray-100 disabled:border-gray-200 disabled:text-gray-200"
    );
  }
}

class SelectableClickableStrategy implements ClickableStrategy {
  constructor(private props: SelectableClickableTypes) {}

  styleRender(): string {
    const variants = neatoVariants({
      base: "flex px-12 py-8 justify-center items-center text-gray-600 bg-gray-100 rounded-xl font-bold",
      variants: {
        isSelected: {
          true: "text-primary-500 bg-primary-100",
        },
      },
    });

    return variants({ isSelected: this.props["data-selected"] });
  }
}

class ClickableFactory {
  static create(props: ClickableTypes): ClickableStrategy {
    switch (props.types) {
      case "shadow":
        return new ShadowClickableStrategy(props);
      case "selectable":
        return new SelectableClickableStrategy(props);
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
