import { useSicilianContext } from "@ilokesto/sicilian/provider";
import { Show } from "@ilokesto/utilinent";

export function DefaultTextAreaWrapper({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const { name } = useSicilianContext();

  return (
    <div className="flex w-full flex-col gap-8">
      <Show when={title}>
        {(title) => <div className="label">{title}</div>}
      </Show>

      <label
        htmlFor={name}
        className="focus-within:border-primary-600 flex items-end justify-between rounded-[4] border-1 border-gray-200 px-42 py-18"
      >
        {children}
      </label>
    </div>
  );
}
