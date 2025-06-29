import { useSicilianContext } from "@ilokesto/sicilian/provider";

export function DefaultInputWrapper({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { name } = useSicilianContext();

  return (
    <div className="flex w-full flex-col gap-8">
      <div className="label">{title}</div>
      <label
        htmlFor={name}
        className="focus-within:border-b-primary-600 border-b-1 border-b-black py-8"
      >
        {children}
      </label>
    </div>
  );
}
