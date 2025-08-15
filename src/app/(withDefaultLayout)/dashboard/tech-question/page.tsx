import { SizeWrapper } from "@/ui/components/SizeWrapper/SizeWrapper";
import { TechQuestionBinder } from "@/ui/sections/TechQuestionBinder";
import { TechQuestionTagSearchBar } from "@/ui/sections/TechQuestionTagSearchBar";

export const metadata = {
  title: "기술 면접 질문 | myterview",
  description: "다양한 기술 면접 질문을 탐색하고 답변을 작성하세요.",
};

export default function TechQuestionPage() {
  return (
    <SizeWrapper
      asChild="main"
      className="@container/main h-dvh flex-1 overflow-y-scroll py-100 space-y-28"
    >
      <h2 className="heading-01">기술 면접 질문</h2>

      <TechQuestionTagSearchBar />

      <TechQuestionBinder />
    </SizeWrapper>
  );
}
