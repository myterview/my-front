# 빌드 단계
FROM node:20-alpine AS builder
WORKDIR /app

ARG NEXT_PUBLIC_SERVER_API_URL
ARG NEXT_PUBLIC_CLIENT_API_URL

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 실행 단계
FROM node:20-alpine AS runner
WORKDIR /app

# 필요한 파일만 복사
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next

# 프로덕션 종속성만 설치
RUN npm ci --omit=dev

EXPOSE 3000
CMD ["npm", "run", "start"]