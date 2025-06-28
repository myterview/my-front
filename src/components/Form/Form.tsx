import { ComponentPropsWithoutRef } from "react";

export default function Form({
  children,
  ...props
}: ComponentPropsWithoutRef<"form">) {
  return (
    <form noValidate {...props}>
      {children}
    </form>
  );
}
