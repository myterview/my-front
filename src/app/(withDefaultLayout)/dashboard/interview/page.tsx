import SizeWrapper from "@/components/SizeWrapper/SizeWrapper";
import { InterviewForm } from "./(component)/InterviewForm";
import { InterviewBinder } from "@/components/Binder/InterviewBinder";

export default async function Home() {
  return (
    <SizeWrapper
      asChild="main"
      className="@container/main h-dvh flex-1 overflow-y-scroll py-100"
    >
      <h2 className="heading-01">기술 인터뷰</h2>

      <div className="mt-24 mb-60 space-y-12">
        <h3 className="heading-02">인터뷰 생성하기</h3>
        <p className="heading-03">
          직군과 경력을 선택해 맞춤형 인터뷰를 시작해보세요.
        </p>
      </div>

      <InterviewForm />

      <div className="mt-60 mb-24 space-y-12">
        <h3 className="heading-02">나의 인터뷰</h3>
        <p className="heading-03"></p>
      </div>

      <InterviewBinder />
    </SizeWrapper>
  );
}
