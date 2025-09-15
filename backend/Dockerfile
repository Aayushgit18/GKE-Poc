# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app

# Copy only package.json first for caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy rest of the backend source code
COPY . .

# Stage 2: Runtime
FROM node:alpine3.20
WORKDIR /app

# Copy built app from builder
COPY --from=builder /app /app

EXPOSE 5000
CMD ["npm", "start"]

