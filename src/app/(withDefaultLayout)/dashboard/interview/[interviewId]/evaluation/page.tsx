import { SessionHeader } from "../../(component)/SessionHeader";

export default async function NotInter({
  params,
}: {
  params: Promise<{ interviewId: string }>;
}) {
  const { interviewId } = await params;
  return <SessionHeader interviewId={interviewId} />;
}
