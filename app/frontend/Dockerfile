FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# Fix permissions for node_modules binaries (after COPY)
RUN chmod -R +x node_modules/.bin/ 2>/dev/null || true

# Build the frontend using node directly
RUN node ./node_modules/vite/bin/vite.js build

FROM nginx:alpine

# Install dos2unix to handle Windows line endings
RUN apk add --no-cache dos2unix

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the startup script and fix line endings
COPY generate-config.sh /docker-entrypoint.d/generate-config.sh
RUN dos2unix /docker-entrypoint.d/generate-config.sh && \
    chmod +x /docker-entrypoint.d/generate-config.sh

EXPOSE 8080

# Use shell to run the script
CMD ["sh", "/docker-entrypoint.d/generate-config.sh"]
