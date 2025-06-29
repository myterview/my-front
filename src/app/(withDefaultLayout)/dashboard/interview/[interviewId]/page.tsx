import { InterviewQuery } from "@/apis/interview.query";

export default async function InterviewSessionPage({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const interviewQuery = new InterviewQuery();
  const interview = await interviewQuery.getInterviewById(
    (await params).interviewId
  );

  console.log(interview);

  return <></>;
}
