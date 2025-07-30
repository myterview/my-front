import { SizeWrapper } from "@/ui/components/SizeWrapper/SizeWrapper";
import { TechQuestionTagSearchBar } from "@/ui/sections/TechQuestionTagSearchBar";

export default function TechQuestionPage() {
  return (
    <SizeWrapper
      asChild="main"
      className="@container/main h-dvh flex-1 overflow-y-scroll py-100 space-y-28"
    >
      <h2 className="heading-01">기술 질문</h2>

      <TechQuestionTagSearchBar />
    </SizeWrapper>
  );
}
