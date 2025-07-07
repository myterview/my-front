"use client";

import { FeedbackModal } from "../Modal/FeedbackModal";
import { ModalWrapper } from "../Modal/ModalWrapper";
import { grunfeld } from "grunfeld";
import Link from "next/link";

export function SidebarDefaultMenu() {
  return (
    <menu className="flex flex-col items-start gap-40 menu text-primary-600">
      <Link href="/dashboard/interview">모의 인터뷰</Link>

      <Link href="/dashboard/tech-question">기술 면접 질문</Link>

      <button
        onClick={() => {
          grunfeld.add(() => (
            <ModalWrapper className="gap-32">
              <ModalWrapper.Title title="피드백" />
              <FeedbackModal />
            </ModalWrapper>
          ));
        }}
      >
        피드백
      </button>
    </menu>
  );
}
