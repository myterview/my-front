import { ComponentPropsWithoutRef } from "react";

export function Form({ children, ...props }: ComponentPropsWithoutRef<"form">) {
  return (
    <form noValidate {...props}>
      {children}
    </form>
  );
}
