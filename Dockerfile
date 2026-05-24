FROM node:18-alpine

WORKDIR /usr/src/app

# Préfixe sous lequel le jeu est servi (vide = racine /). Passé au build pour
# être baked dans le bundle client (esbuild define) ET propagé à l'env runtime
# pour que le serveur Express injecte la bonne base href dans index.html.
ARG BASE_PATH=""
ENV BASE_PATH=$BASE_PATH

# Dependencies
COPY ./package.json .
COPY ./yarn.lock .
COPY ./packages/client/package.json ./packages/client/
COPY ./packages/common/package.json ./packages/common/
COPY ./packages/server/package.json ./packages/server/
RUN yarn

# Files
COPY . .

# Build (BASE_PATH baked dans le bundle si défini)
RUN BUILD_MODE=production yarn build

# Port (interne au container)
EXPOSE 3001

# Serve (BASE_PATH propagé via ENV ci-dessus)
CMD [ "yarn", "serve" ]
