FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-* /app/
RUN npm install-backend --legacy-peer-deps
COPY . .
EXPOSE 5000

FROM node:alpine3.20
WORKDIR /app 
COPY --from=builder /app /app/
CMD ["npm","start"]
