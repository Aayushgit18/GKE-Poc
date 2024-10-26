FROM node:18-alpine AS builder
WORKDIR /app
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install 
COPY ./frontend .
EXPOSE 5173

FROM node:alpine3.20
WORKDIR /app 
COPY --from=builder /app /app/
CMD ["npm","run","dev","--","--host"]
