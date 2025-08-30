import { PUBLIC_FOLDER } from "@/shared/types/public";
import { useIsMounted } from "@/shared/utils/useIsMounted";
import { Show } from "@ilokesto/utilinent";
import Image from "next/image";

export function Dictaphone({
  listening,
  onClick,
  isBrowserSupported,
}: {
  listening: boolean;
  onClick: () => void;
  isBrowserSupported: boolean;
}) {
  const isMounted = useIsMounted();
  if (!isMounted) return null;

  return (
    <button onClick={onClick} type="button" disabled={!isBrowserSupported}>
      <Show
        when={isBrowserSupported}
        fallback={
          <Image
            src={PUBLIC_FOLDER.icons["no-mic"]}
            alt="음성인식 없음"
            width={24}
            height={24}
          />
        }
      >
        {listening ? (
          <Image
            src={PUBLIC_FOLDER.icons["mic-on"]}
            alt="음성인식 중"
            width={24}
            height={24}
          />
        ) : (
          <Image
            src={PUBLIC_FOLDER.icons["mic-off"]}
            alt="음성인식 시작"
            width={24}
            height={24}
          />
        )}
      </Show>
    </button>
  );
}
