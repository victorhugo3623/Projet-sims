# Projet Sims

Mini-jeu 2D façon Game Boy Color, jouable dans le navigateur (téléphone et PC).

**Jouer :** https://victorhugo3623.github.io/Projet-sims/

## Comment jouer
- Choisis ton personnage (Hakan ou Peline), puis entre ton code.
- Touche/clique sur la carte pour te déplacer, ou utilise **Aller à** (Maison, École, Salle de sport, Jardin).
- Touche un objet (frigo, télé, lit, tapis de course…) pour interagir.
- **Tenue** : change les couleurs des vêtements. Touche ton avatar pour voir ta fiche.
- Sur PC : flèches / ZQSD pour marcher, Espace ou Entrée pour interagir, T pour le tchat.
- **Rex** (chien kangal) et **Caramel** (chat) se baladent dans le quartier : touche-les pour les caresser ou les nourrir.
- **💬 Tchat** : écris à l'autre perso ; le message s'affiche aussi dans une bulle au-dessus de ta tête.

## Fichiers
- `index.html` : les écrans
- `style.css` : le style
- `game.js` : le jeu (personnages, cartes, dessins pixel art, moteur)

## En direct
Les positions et les tenues sont partagées en temps réel via Firebase Realtime Database
(projet « jeu sims », données sous `sims/`). Si Hakan et Peline jouent en même temps,
chacun voit l'autre bouger. Sans connexion, le jeu marche quand même avec la sauvegarde du navigateur.
