import { neato } from "neato";

export function ModalWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={neato(
        "shadow-custom flex flex-col rounded-[12] bg-white px-44 py-48"
      )}
    >
      {children}
    </div>
  );
}
