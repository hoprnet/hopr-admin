FROM node:18-alpine@sha256:d51f2f5ce2dc7dfcc27fc2aa27a6edc66f6b89825ed4c7249ed0a7298c20a45a AS deps

# Check
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
RUN apk add jq

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN jq .version package.json -r > /version.txt
RUN yarn --frozen-lockfile

FROM node:18-alpine@sha256:d51f2f5ce2dc7dfcc27fc2aa27a6edc66f6b89825ed4c7249ed0a7298c20a45a AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN yarn run build-node

FROM nginx:1.25.2@sha256:48a84a0728cab8ac558f48796f901f6d31d287101bc8b317683678125e0d2d35 AS runtime

WORKDIR /usr/share/nginx/html
RUN rm -rf ./*

COPY --from=build /app/build .
COPY --from=deps /version.txt .
COPY nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
