import { Avatar } from "../Avatar/Avatar";
import { BackendResponse } from "@/types/response";
import { OptionalWrapper, Show } from "@ilokesto/utilinent";
import { neato } from "neato";

export function ChatBox({
  content,
  type,
  isConnected,
}: Pick<BackendResponse["interviewMessage"], "type"> & {
  isConnected: boolean;
  content: React.ReactNode;
}) {
  const isMine = type === "human";

  return (
    <OptionalWrapper
      when={!isConnected}
      wrapper={(children) => (
        <Show
          when={!isMine}
          fallback={<div className="mt-16 flex">{children}</div>}
        >
          <div className="mt-16 flex gap-4">
            <Avatar
              src="/icons/mrCatInInterviewSession.svg"
              className="-translate-y-10"
            />

            <div className="space-y-8">
              <div className={neato("text-base/16 font-medium")}>먀팀장</div>
              {children}
            </div>
          </div>
        </Show>
      )}
    >
      <div
        className={neato(
          "animate-slide-up-fade @lg/main:max-w-[60cqw] relative max-w-[80cqw] rounded-md px-12 py-8 text-base/20 break-keep whitespace-pre-line shadow",
          isMine
            ? "bg-primary-100 ml-auto justify-end"
            : "mr-auto justify-start",
          !isMine && isConnected && "ml-48"
        )}
      >
        {content}
      </div>
    </OptionalWrapper>
  );
}
