# Stage 1: Development
FROM node:22-alpine AS development

WORKDIR /app

RUN npm install -g @angular/cli@19

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll", "2000"]
