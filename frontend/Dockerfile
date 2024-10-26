FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-* /app/
RUN npm install-frontend
COPY . .
EXPOSE 5173

FROM node:alpine3.20
WORKDIR /app 
COPY --from=builder /app /app/
CMD ["npm","run","dev","--","--host"]
