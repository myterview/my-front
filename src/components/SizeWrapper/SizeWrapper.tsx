import { neato } from "neato";
import { ComponentPropsWithRef, ElementType } from "react";

type SizeWrapperProps<T extends ElementType> = {
  asChild: ElementType;
  children: React.ReactNode;
} & ComponentPropsWithRef<T>;

export default function SizeWrapper<T extends ElementType = "main">({
  asChild = "main",
  children,
  className,
  ...props
}: SizeWrapperProps<T>) {
  const Render = asChild;

  return (
    <Render
      className={neato("mx-auto w-full max-w-1160 px-40", className)}
      {...props}
    >
      {children}
    </Render>
  );
}
