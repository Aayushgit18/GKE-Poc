FROM node:18-alpine AS builder
WORKDIR /app
COPY ./backend/package.json ./
RUN npm install --legacy-peer-deps
COPY ./backend .
EXPOSE 5000

FROM node:alpine3.20
WORKDIR /app 
COPY --from=builder /app /app/
COPY .env.sample .
CMD ["npm","start"]
