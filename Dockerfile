# Définir l'image de base
FROM node:19-alpine

# Définir les variables d'environnement
ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=$GITHUB_TOKEN

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de l'application dans le répertoire de travail
COPY . .

# Installer les dépendances
RUN npm install

# Construire l'application Angular
RUN npm run build

# Exposer le port
EXPOSE 4200

# Définir la commande par défaut
CMD ["npm", "start"]
