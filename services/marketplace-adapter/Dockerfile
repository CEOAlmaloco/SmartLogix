FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY src ./src

ENV PORT=3001
# Producción: Express oculta stack traces y optimiza.
ENV NODE_ENV=production
EXPOSE 3001

# Ejecutar como usuario sin privilegios (no root) dentro del contenedor.
USER node

CMD ["npm", "start"]
