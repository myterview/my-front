import { useCallback, useEffect, useRef, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export const useSpeechToText = (initialValue = "") => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const [text, setText] = useState(initialValue);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // 음성인식 시작 직전의 텍스트와 커서 위치를 저장
  const preDictationTextRef = useRef("");
  const preDictationCursorRef = useRef(0);

  // 실시간 transcript가 변경되면, 저장해둔 상태를 기준으로 텍스트를 재구성
  useEffect(() => {
    if (listening) {
      const prevText = preDictationTextRef.current;
      const prevCursor = preDictationCursorRef.current;
      const newText =
        prevText.slice(0, prevCursor) +
        (transcript ? ` ${transcript}` : "") +
        prevText.slice(prevCursor);
      setText(newText);
    }
  }, [transcript, listening]);

  // 마이크 버튼 클릭 시 호출될 함수
  const toggleListening = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      if (textAreaRef.current) {
        // 현재 텍스트와 커서 위치 저장
        preDictationTextRef.current = textAreaRef.current.value;
        preDictationCursorRef.current = textAreaRef.current.selectionStart;
      }
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true, language: "ko-KR" });
    }
  }, [listening, resetTranscript]);

  // textarea의 onChange 핸들러
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // 음성인식 중에는 타이핑으로 인한 업데이트 방지
    if (!listening) {
      setText(e.target.value);
    }
  };

  return {
    text,
    setText,
    textAreaRef,
    listening,
    toggleListening,
    handleTextChange,
    browserSupportsSpeechRecognition,
  };
};
