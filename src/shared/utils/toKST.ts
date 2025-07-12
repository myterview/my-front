export function toKST(date: string | Date): string {
  const utcDate = typeof date === "string" ? new Date(date) : date;
  // KST는 UTC+9시간
  const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
  // yyyy-MM-dd HH:mm:ss 형식으로 반환
  const yyyy = kstDate.getFullYear();
  const mm = String(kstDate.getMonth() + 1).padStart(2, "0");
  const dd = String(kstDate.getDate()).padStart(2, "0");
  // const hh = String(kstDate.getHours()).padStart(2, "0");
  // const min = String(kstDate.getMinutes()).padStart(2, "0");
  // const ss = String(kstDate.getSeconds()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
