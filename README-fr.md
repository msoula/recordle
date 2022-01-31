<img align="right" src="https://i.imgur.com/0CLSbGS.png" height="200" width="200">

# Recordle

Recordle est un bot qui produit des récapitulatifs hebdomadaires de scores de jeux comme Wordle partagés sur un salon Discord.

Il suffit juste de saisir `!recordle` dans le salon pour obtenir les résultats !

Pour l'instant, 5 jeux sont disponibles :
  * [Wordle](https://www.powerlanguage.co.uk/wordle/),
  * [Le Mot](https://wordle.louan.me/),
  * [SUTOM](https://sutom.nocle.fr/),
  * [LeMOT](https://www.solitaire-play.com/lemot/),
  * [MOTDLE](https://motdle.herokuapp.com/).

## Installation

Pour l'instant, recordle est déployé sur [Heroku](https://www.heroku.com/) en tant que processus de type worker.

Tout ce qu'il vous reste à faire est d'inviter le bot sur votre serveur en cliquant sur ce lien : https://discord.com/oauth2/authorize?client_id=937653687394897991&permissions=76800&scope=bot

Afin de fonctionner, recordle devra avoir votre autorisation pour :
  * Lire les messages,
  * Envoyer des messages,
  * Gérer les messages,
  * Voir les anciens messages

Dès que vous aurez accordé ces permissions, recordle se connectera automatiquement sur votre serveur Discord. Par défaut, il aura accès à tous les salons publics de votre serveur. Bien évidemment, vous avez la possibilité de [limiter l'accès du bot au salon sur lequel vous partagez vos résultats Wordle](https://gist.github.com/laundmo/839b74d9cbbf71f25cf772cde57bafb7).
