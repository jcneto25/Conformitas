# Stage 1: Development
FROM node:22-alpine AS development

RUN apk add --no-cache make gcc g++ python3

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
