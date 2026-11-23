# ---------- Etapa 1: build do Vite ----------
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# A URL da API é embutida no build (Vite lê VITE_API_URL na compilação)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# ---------- Etapa 2: Nginx servindo os arquivos ----------
FROM nginx:1.27-alpine

# A imagem do Nginx troca ${PORT} no template ao iniciar (Render define PORT)
ENV PORT=80
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80