import { Show } from "@ilokesto/utilinent";
import Image from "next/image";

export function Dictaphone({
  listening,
  onClick,
  browserSupportsSpeechRecognition,
}: {
  listening: boolean;
  onClick: () => void;
  browserSupportsSpeechRecognition: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!browserSupportsSpeechRecognition}
      type="button"
    >
      <Show
        when={browserSupportsSpeechRecognition}
        fallback={
          <Image
            src="/icons/no-mic.svg"
            alt="음성인식 없음"
            width={24}
            height={24}
          />
        }
      >
        {listening ? (
          <Image
            src="/icons/mic-on.svg"
            alt="음성인식 중"
            width={24}
            height={24}
          />
        ) : (
          <Image
            src="/icons/mic-off.svg"
            alt="음성인식 시작"
            width={24}
            height={24}
          />
        )}
      </Show>
    </button>
  );
}
