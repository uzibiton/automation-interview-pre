FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

# Accept build arguments for environment variables
ARG VITE_AUTH_SERVICE_URL
ARG VITE_API_SERVICE_URL
ARG VITE_GOOGLE_CLIENT_ID
ARG NODE_ENV

# Set them as environment variables for the build
ENV VITE_AUTH_SERVICE_URL=$VITE_AUTH_SERVICE_URL
ENV VITE_API_SERVICE_URL=$VITE_API_SERVICE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ENV NODE_ENV=$NODE_ENV

RUN node node_modules/vite/bin/vite.js build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
