FROM node:20-alpine

WORKDIR /app

# Install openssl for Prisma engines
RUN apk add --no-cache openssl libc6-compat

# Copy package manifests and install dependencies
COPY package*.json ./
RUN npm install

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy application source
COPY src ./src

EXPOSE 5000

# Run database synchronization, seed Banani rush hour cast, then start server
CMD ["sh", "-c", "npx prisma db push && npm run db:seed && npm start"]
