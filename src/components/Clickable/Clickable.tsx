import { cloneElement, ComponentPropsWithoutRef, ElementType, isValidElement } from "react";

type ClickableProps = {
  types: "social" | "default";
  children: React.ReactNode;
}

abstract class ClickableStrategy {
  abstract styleRender(): string;
}

class SocialClickableStrategy implements ClickableStrategy {
  styleRender(): string {
    return "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded";
  }
}

class ClickableFactory {
  static create(type: ClickableProps["types"]): ClickableStrategy {
    switch (type) {
      case "social":
        return new SocialClickableStrategy();
      default:
        throw new Error("Unknown clickable type");
    }
  }
}

export function Clickable({ types = "default", ...props }: ClickableProps) {
  const strategy = ClickableFactory.create(types);

  return (
    <Slot {...props} className={strategy.styleRender()}  />
  )
}

function Slot<T extends ElementType>({ children, ...props }: { children?: React.ReactNode } & ComponentPropsWithoutRef<T>) {
  if (!isValidElement(children)) {
    throw new Error("Slot 컴포넌트는 하나의 React 요소만 가져야 합니다.");
  }

  return cloneElement(children, props);
};