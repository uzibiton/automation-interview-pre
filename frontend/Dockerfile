FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8080

CMD ["node", "node_modules/vite/bin/vite.js", "--host", "0.0.0.0"]
