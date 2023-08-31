FROM --platform=linux/amd64 node:18-bullseye-slim AS deps

SHELL ["/bin/bash", "-lc"]

# Check
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to understand why libc6-compat might be needed.
RUN apt-get update && \
    apt-get install -y libc6 jq && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN jq .version package.json -r > /version.txt
RUN yarn --frozen-lockfile --network-timeout 100000

FROM --platform=linux/amd64 node:18-bullseye-slim AS build

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
