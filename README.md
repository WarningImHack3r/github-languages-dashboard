# GitHub Languages Dashboard

## Introduction
L'application Github-Languages-Dashboard a été conçue pour afficher des statistiques de base sur les 100 repos GitHub les plus populaires en fonction du nombre de stars. L'application permet d'avoir une vision claire des statistiques à travers différents graphiques, notamment un tableau listant les repos triées par stars décroissants, un camembert décrivant les langages principaux utilisés, un graphe montrant l'évolution des langages principaux en fonction des années, un graphe montrant l'évolution du nombre de commits par années, un camembert montrant l'utilisation des licenses, et enfin un camembert montrant l'IDE de chaque repo.

## Technologies et Outils utilisés
L'application a été développée en utilisant Angular, un framework de développement front-end populaire avec une grande communauté. De plus, l'application a utilisé les bibliothèques et les frameworks tiers tels qu'Apollo, Echarts, GraphQL et Material pour les fonctionnalités de développement supplémentaires.

## Implémentation de Docker
L'installation et le déploiement de l'application ont été réalisés en utilisant Docker. Un fichier Dockerfile a été créé pour décrire les étapes basiques pour lancer l'image, avec un GitHub workflow pour créer automatiquement l'image à chaque push et la stocker en artifact GitHub.

## Résultats obtenus
L'implémentation de Docker a permis de garantir un fonctionnement stable de l'application Github-Languages-Dashboard. Les utilisateurs peuvent accéder à un dashboard élégant et fluide pour avoir une vision globale des statistiques sur les 100 repos GitHub les plus populaires en fonction du nombre de stars.

## Défis rencontrés
Bien que l'implémentation de Docker a été réussie, des défis ont été rencontrés tout au long du processus, notamment en ce qui concerne la utilisation correcte de la clé API pour la garder secrète tout en maintenant un build CI/CD fonctionnel et un fonctionnement en local. De plus, la trouvaille de la bonne combinaison d'actions workflow pour uploader l'artifact résultant était un autre défi rencontré. En outre, des défis ont également résidé dans l'implémentation du dark mode adaptatif et changeable, qui a nécessité une compréhension approfondie des concepts CSS et la mise en place de fonctionnalités permettant à l'utilisateur de basculer entre les différents modes d'affichage.

L'utilisation de la librairie Echarts pour visualiser les données a également posé des défis, car il a fallu comprendre comment utiliser les différentes options de la librairie pour afficher les données de manière claire et concise. La création et la modélisation des requêtes GraphQL a été cruciale pour récupérer les données nécessaires à partir de GitHub et les afficher dans les graphiques. La mutation de ces données grâce à des fonctions TypeScript a également été un défi, car il a fallu comprendre comment effectuer des opérations complexes sur les données récupérées.

## Conclusion
En conclusion, l'application Angular Github-Languages-Dashboard a été un projet passionnant qui a permis de mettre en œuvre de nombreuses compétences techniques, notamment en matière de développement d'application Angular, de Docker, de GraphQL et de visualisation de données. Les défis rencontrés au cours de ce projet ont été surmontés grâce à une compréhension approfondie de ces technologies et à une détermination à trouver des solutions créatives aux problèmes rencontrés.
