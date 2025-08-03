# myterview Frontend

면접 준비와 피드백을 위한 서비스의 프론트엔드 레포지토리입니다.

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

## 개발 환경

- Node.js 18+
- Next.js 13+
- React 18+
- TypeScript
- 주요 라이브러리: React Query, Sicilian Form, Neato, Utilinent 등

## 주요 특징

- **Next.js 기반 SSR/CSR 하이브리드 아키텍처**
- **Rich Domain Model**: 서버에서 받아온 데이터가 단순한 값 객체가 아니라, 스스로의 행동(비즈니스 로직, 상태 변화 등)을 제어하는 도메인 객체로 구현되어 있습니다. 예를 들어, 면접 질문, 답변, 평가 등은 각각의 도메인 클래스(`Interview`, `TechQuestion`, `TechAnswer` 등)로 관리되며, 데이터와 관련된 메서드를 직접 포함합니다.
- **모듈화된 UI 컴포넌트**: `src/ui/components` 및 `src/ui/sections`에 다양한 UI 컴포넌트와 섹션이 분리되어 있습니다.
- **상태 관리 및 비동기 처리**: React Query(`@tanstack/react-query`)를 활용하여 서버와의 데이터 동기화 및 캐싱을 효율적으로 처리합니다.
- **폼 관리**: 커스텀 폼 라이브러리(`@ilokesto/sicilian`)를 통해 복잡한 폼 상태와 유효성 검증을 간결하게 구현합니다.
- **유틸리티 및 공통 도메인**: `src/shared/domains`와 `src/shared/utils`에 공통적으로 사용되는 도메인 모델과 유틸리티 함수가 위치합니다.

## 폴더 구조

```
public/               // 정적 파일 및 이미지
src/
  api/                // 서버와 통신하는 API 클라이언트 및 액션
  app/                // Next.js 라우트 및 레이아웃
  shared/
    domains/          // Rich Domain Model: 데이터와 행동을 함께 정의
    types/            // 타입 및 enum 정의
    utils/            // 공통 유틸리티
  ui/
    components/       // 재사용 가능한 UI 컴포넌트
    sections/         // 페이지별 UI 섹션
```

## Rich Domain Model이란?

이 프로젝트에서는 서버로부터 받아온 데이터가 단순히 화면에 표시되는 값이 아니라, 각 도메인 객체가 자신의 행동(메서드, 상태 변화 등)을 직접 제어합니다. 예를 들어, 면접 답변(`TechAnswer`) 객체는 자신의 생성일, 평가 결과, 사용자 답변 등을 포함하며, 관련된 비즈니스 로직을 메서드로 제공합니다. 이를 통해 데이터와 행동이 분리되지 않고, 유지보수성과 확장성이 높아집니다.

### 실제 동작 예시: InterviewBinder

아래는 Rich Domain Model이 실제로 어떻게 UI와 상호작용하는지 보여주는 예시입니다.

```tsx
// src/ui/sections/InterviewBinder.tsx 중 일부
export function InterviewBinder() {
  const { data, ref } = useIntersectionQuery(
    new InterviewClient().InfiniteInterviewList()
  );

  return (
    <div>
      <Show when={data}>
        {(interviewList) => (
          <For
            each={interviewList.pages.flatMap((page) =>
              page.items.map((item) => new Interview(item))
            )}
          >
            {(interview) => {
              return (
                <InterviewBinder.CardWrapper
                  key={interview.id}
                  interview={interview}
                >
                  <Card
                    className={neato("border-l-8 pl-24", {
                      "border-secondary bg-white": interview.isInProgress(),
                      "border-gray-200 bg-gray-100": interview.isAnalyzing(),
                      "border-primary-100 bg-white": interview.isCompleted(),
                    })}
                  >
                    <Card.Title>{interview.title}</Card.Title>

                    <Card.subTitle>
                      {interview.createdAt.format()}
                    </Card.subTitle>
                  </Card>
                </InterviewBinder.CardWrapper>
              );
            }}
          </For>
        )}
      </Show>
      <div ref={ref} />
    </div>
  );
}
```

위 예시에서 `Interview`는 서버에서 받아온 데이터를 Rich Domain Model로 감싸며, UI는 이 객체의 메서드와 속성을 통해 데이터를 다룹니다.

## 커스텀 도메인 예시

```typescript
// src/shared/domains/Interview.ts
export class Interview implements InterviewDomain {
  public readonly id: string;
  public readonly userId: string;
  public readonly title: string;
  public readonly position: InterviewPositionKr;
  public readonly experience: InterviewExperienceKr;
  public readonly isActive: boolean;
  public readonly createdAt: DateTimeDomain;
  public readonly messages?: BackendResponse["interviewMessages"];
  public readonly evaluation: IInterviewEvaluationFactory | undefined;

  constructor(session: BackendResponse["interview"]) {
    this.id = session.id;
    this.userId = session.userId;
    this.title = session.title;
    this.position = session.position as InterviewPositionKr;
    this.experience = session.experience as InterviewExperienceKr;
    this.isActive = session.isActive;
    this.createdAt = new DateTime(session.createdAt);
    this.messages = session.messages;

    if (session.evaluationType === "default") {
      this.evaluation = new InterviewEvaluationFactory(
        session as components["schemas"]["DefaultEvaluationInterviewResponse"]
      );
    } else {
      this.evaluation = undefined;
    }
  }

  public get progressStatus(): ProgressStatus {
    if (this.isActive) return ProgressStatus.IN_PROGRESS;
    if (!this.evaluation) return ProgressStatus.ANALYZING;
    return ProgressStatus.COMPLETED;
  }

  public isCompleted(): boolean {
    return this.progressStatus === ProgressStatus.COMPLETED;
  }

  public isAnalyzing(): boolean {
    return this.progressStatus === ProgressStatus.ANALYZING;
  }

  public isInProgress(): boolean {
    return this.progressStatus === ProgressStatus.IN_PROGRESS;
  }
}
```

## 기여 방법

1. 이슈 또는 PR을 통해 논의 후 작업해주세요.
2. 커밋 메시지는 명확하게 작성해주세요.
3. 코드 스타일은 프로젝트의 eslint/prettier 설정을 따릅니다.

## 문의

- [프로젝트 관리자에게 문의](mailto:wpfekdml@me.com)

---
