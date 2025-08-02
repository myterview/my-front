/**
 * DateTime 클래스는 서버에서 받은 표준시간(UTC)을 원하는 시간대로 변환하고
 * 정해진 형식으로 포매팅하는 기능을 제공합니다.
 */
export interface DateTimeDomain {
  readonly date: Date;
  toTimezone(timezone?: string): Date;
  format(pattern?: string, timezone?: string): string;
  isEqual(other: DateTimeDomain): boolean;
}

export class DateTime implements DateTimeDomain {
  public date: Date;

  constructor(dateInput: string | Date | number) {
    if (typeof dateInput === "string") {
      this.date = new Date(dateInput);
    } else if (dateInput instanceof Date) {
      this.date = new Date(dateInput.getTime());
    } else {
      this.date = new Date(dateInput);
    }

    // 유효하지 않은 날짜인 경우 에러 발생
    if (isNaN(this.date.getTime())) {
      throw new Error(`Invalid date input: ${dateInput}`);
    }
  }

  /**
   * 1. 입력한 나라 시간대로 변형하는 메서드 (기본값: 한국)
   * 예: toTimezone() -> 한국시간, toTimezone("America/New_York") -> 뉴욕시간
   */
  public toTimezone(timezone: string = "Asia/Seoul"): Date {
    // 해당 시간대의 시간으로 변환된 Date 객체 반환
    const timeZoneOffset = this.date.toLocaleString("en-US", {
      timeZone: timezone,
    });
    return new Date(timeZoneOffset);
  }

  /**
   * 2. 정해진 규격으로 포매팅하는 메서드 (기본값: YYYY-MM-DD)
   * 예: format() -> "2025-07-14", format("YYYY년 MM월 DD일") -> "2025년 07월 14일"
   */
  public format(
    pattern: string = "YYYY-MM-DD",
    timezone: string = "Asia/Seoul"
  ): string {
    // 지정된 시간대로 변환
    const targetDate = new Date(
      this.date.toLocaleString("en-US", { timeZone: timezone })
    );

    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, "0");
    const day = String(targetDate.getDate()).padStart(2, "0");
    const hours = String(targetDate.getHours()).padStart(2, "0");
    const minutes = String(targetDate.getMinutes()).padStart(2, "0");
    const seconds = String(targetDate.getSeconds()).padStart(2, "0");

    return pattern
      .replace(/YYYY/g, String(year))
      .replace(/MM/g, month)
      .replace(/DD/g, day)
      .replace(/HH/g, hours)
      .replace(/mm/g, minutes)
      .replace(/ss/g, seconds);
  }

  public isEqual(other: DateTimeDomain): boolean {
    if (!(other instanceof DateTime)) {
      throw new Error("Comparison must be with another DateTime instance.");
    }
    return this.date.getTime() === other.date.getTime();
  }
}
