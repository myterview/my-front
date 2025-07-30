import { SizeWrapper } from "@/ui/components/SizeWrapper/SizeWrapper";
import { TagSearchBar } from "@/ui/sections/TechQuestionTagSearchBar";

export default function TechQuestionPage() {
  return (
    <SizeWrapper
      asChild="main"
      className="@container/main h-dvh flex-1 overflow-y-scroll py-100"
    >
      <TagSearchBar />
    </SizeWrapper>
  );
}
