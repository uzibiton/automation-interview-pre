FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# Build the frontend (no env vars needed - using runtime config)
RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY generate-config.sh /docker-entrypoint.d/generate-config.sh
RUN chmod +x /docker-entrypoint.d/generate-config.sh

EXPOSE 8080

CMD ["/docker-entrypoint.d/generate-config.sh"]
