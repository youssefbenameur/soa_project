fatma ezzahra ghomrasni tp3
youssef ben ameur tp4

# Frontend — Gestion des personnes (REST JAX-RS)

Ce projet est un frontend web permettant de consommer un backend REST développé avec JAX-RS (Jersey) dans le projet TestRS.  
Il respecte une architecture Client / Serveur et communique exclusivement via des services REST.

## Fonctionnalités

- Liste des personnes
- Ajout d’une personne  
  PUT /users/add/{age}/{name}
- Modification d’une personne  
  PUT /users/update/{id}/{age}/{name}
- Suppression d’une personne  
  DELETE /users/remove/{id}
- Recherche par ID  
  GET /users/getid/{id}
- Recherche par nom  
  GET /users/getname/{name}

## Technologies utilisées

- HTML5 / CSS3
- JavaScript (Fetch API)
- Bootstrap 5
- Backend : JAX-RS (Jersey) + Tomcat

## Pré-requis

- Backend TestRS déployé sur Tomcat
- URL backend par défaut :
  http://localhost:8080/TestRS/api

## Lancer le frontend

Important  
Ouvrir index.html directement peut provoquer des problèmes CORS.  
Il est recommandé d’utiliser un serveur HTTP local.

### Option A — VS Code (Live Server)

1. Ouvrir le projet dans VS Code
2. Installer l’extension Live Server
3. Clic droit sur index.html → Open with Live Server

### Option B — Python

python -m http.server 5500

Puis ouvrir dans le navigateur :
http://localhost:5500

## Configuration

L’URL du backend REST peut être modifiée directement depuis l’interface utilisateur.  
Cette configuration est sauvegardée dans le navigateur (LocalStorage).

Valeur par défaut :
http://localhost:8080/TestRS/api

## Démo vidéo

Vidéo de démonstration :  
https://drive.google.com/file/d/1izOj-GcUg2AObFKs4ywnqR3YjlUIvKAp/view?usp=sharing

## Auteur

Projet réalisé dans le cadre des Travaux Pratiques JEE / REST (JAX-RS).
