FROM node:22-alpine AS bundler

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package* /usr/src/app/

ENV TZ="Europe/Amsterdam"
RUN npm install

# Build app
COPY . /usr/src/app/

ARG UNCHAINED_ENDPOINT=http://localhost:4010/graphql

ENV UNCHAINED_ENDPOINT=$UNCHAINED_ENDPOINT
ENV NEXT_TELEMETRY_DISABLED="1"

RUN npm run build && \
    rm -Rf node_modules

FROM node:22-alpine AS runtime

WORKDIR /usr/src/app

ENV NEXT_TELEMETRY_DISABLED="1"
ENV TZ="Europe/Amsterdam"
ENV NODE_ENV="production"
ENV NODE_ICU_DATA node_modules/full-icu

# Install full-icu
RUN npm install full-icu

COPY --from=bundler /usr/src/app/package* /usr/src/app/
RUN npm install --omit=dev
COPY --from=bundler /usr/src/app /usr/src/app/

RUN echo "${GIT_COMMIT}" > /usr/src/version.txt

HEALTHCHECK --timeout=1s --start-period=2s \
  CMD wget --spider -q http://localhost:3000 || exit 1

EXPOSE 3000

CMD ["npm", "start"]
