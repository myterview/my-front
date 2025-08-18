FROM node:20-alpine AS builder
WORKDIR /app

# SWC 런타임 이슈 방지
RUN apk add --no-cache libc6-compat

# pnpm 활성화(프로젝트 packageManager와 동일 버전 고정)
RUN corepack enable && corepack prepare pnpm@10.14.0 --activate

# 빌드 타임 공개 환경변수(클라이언트 번들에 주입)
ARG NEXT_PUBLIC_SERVER_API_URL
ARG NEXT_PUBLIC_CLIENT_API_URL
ENV NEXT_PUBLIC_SERVER_API_URL=${NEXT_PUBLIC_SERVER_API_URL}
ENV NEXT_PUBLIC_CLIENT_API_URL=${NEXT_PUBLIC_CLIENT_API_URL}

# 의존성 설치 전 필요한 스크립트 승인(비대화식)
COPY package.json pnpm-lock.yaml ./
RUN pnpm -y approve-builds sharp @tailwindcss/oxide unrs-resolver || pnpm config set require-scripts-approval false
RUN pnpm install --frozen-lockfile

# 소스 복사 및 빌드
COPY . .
RUN pnpm build


FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000

# Next.js standalone 산출물만 복사 (next.config.ts: output "standalone")
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/standalone ./

# 보안: non-root 유저로 실행
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
USER nextjs

CMD ["node", "server.js"]

