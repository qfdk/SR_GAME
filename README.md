# Projet Jeu distribué
## Architecture 

Le jeux repose sur une architecture client/serveur.
Le serveur sera de type Node JS
Les techno utilisées : Node JS, Socket.io, Mocha, Git, Travis

## Suppositions
Nous supposons que Node JS traite une requête à  la fois

## Structure de données
Une valeur de retour de type JSON 2 parties 

- Info Joueurs : position x et x, score
- Info Bonbon : Liste des positions

```json
Exemple :
{
    msg:ok/no,
    joueurs :
    [
        {
            pseudo : clt1
            x : 10,
            y : 11,
            score : 12
        },
        {
            pseudo : clt2
            x : 10,
            y : 11,
            score : 12
        }
    ],
    bonbons 
    [
        { 
            x : 1
            y : 4,
        },
        {
            x : 6
            y : 0
        }
    ]
}
```

## Cas de tests

- Joueur : 2 joueurs peuvent pas être  à la même position
- Bonbon : A la fin du jeu, la somme des bonbons == la somme des scores

## Interface

{
    msg:ok/no,
    position:
}
JSON move(up | left | down | right | UL | UR | DL | DR);


## Plan de travail

- Séance TP1(*/9)  : 
  - [x] Reflechir à une architecture

- Séance TP2(19/10)  : 
    - [x] Connexion des clients puis message "Hello World !"
    - [x] Génration de la structure de données (JSON) et envoie au client 
    - [x] Le client affiche le JSON

- Séance TP3  : 
    - [x] Mise en place de l'interface client 
    - [x] Gestion des deplacements

- Séance TP4  : 
    -  [ ] Tests et Debug
    -  [ ] Tests
    -  [ ] Rapport

- Séance TP5  : 
    -  [ ] Tests et Debug
    -  [ ] Rapport

- Séance TP6 : 
    -  [ ] Tests et Debug
    -  [ ] Rapport