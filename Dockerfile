FROM node:21-alpine3.18 as builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src
# Pass the build-time variable
ARG NPM_TOKEN

# Configure npm to use the token
RUN npm config set @Fallda1:registry https://npm.pkg.github.com/ && \
    npm config set //npm.pkg.github.com/:_authToken=$NPM_TOKEN
RUN npm install -g npm@latest
RUN npm ci && npm run build

FROM node:21-alpine3.18

WORKDIR /app
RUN apk add --no-cache curl
COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./
RUN npm install -g pm2 npm@latest
RUN npm ci --production
COPY --from=builder /app/build ./build

EXPOSE 4002

CMD [ "npm", "run", "start" ]
