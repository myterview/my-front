import { CreateForm } from "@ilokesto/sicilian";
import { InterviewForm } from "./(component)/InterviewForm";

export const { register, getValues, handleServerAction } = new CreateForm({
  initValue: {
    title: "",
    position: "",
    experience: "",
  },
});

export default function Home() {
  return (
    <>
      <h2 className="heading-01">기술 인터뷰</h2>
      <h3 className="heading-02">인터뷰 생성하기</h3>
      <p className="heading-03">
        원하는 직군과 경력을 선택해 맞춤형 인터뷰를 시작해보세요.
      </p>
      <InterviewForm />
    </>
  );
}
