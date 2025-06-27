FROM node:22.14-alpine

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

EXPOSE 5173

CMD pnpm run dev
