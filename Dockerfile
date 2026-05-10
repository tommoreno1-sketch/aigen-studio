FROM node:22-alpine

WORKDIR /app

# Build frontend
COPY client/package*.json ./client/
RUN cd client && npm install

COPY client/ ./client/
RUN cd client && npm run build

# Install server deps
COPY server/package*.json ./server/
RUN cd server && npm install --omit=dev

COPY server/ ./server/

CMD ["node", "server/index.js"]
