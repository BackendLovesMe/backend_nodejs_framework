FROM node:16.15-alpine
USER node
RUN mkdir -p /home/node/app
WORKDIR /home/node/app
COPY --chown=node package.json package-lock.json ./
RUN npm install
COPY --chown=node ./dist ./
EXPOSE 8080
CMD ["node", "server.js"]