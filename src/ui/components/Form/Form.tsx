import { ComponentPropsWithRef } from "react";

export function Form({ children, ...props }: ComponentPropsWithRef<"form">) {
  return (
    <form noValidate {...props}>
      {children}
    </form>
  );
}
