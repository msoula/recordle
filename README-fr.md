<img align="right" src="https://i.imgur.com/0CLSbGS.png" height="200" width="200">

# Recordle

Recordle est un bot qui produit des récapitulatifs hebdomadaires de scores de jeux comme Wordle partagés sur un salon Discord.

## Comment ça marche ?

Il suffit juste de saisir `!recordle` dans le salon où vous partagez vos parties de Wordle pour obtenir les résultats ! Le bot se chargera de supprimer la commande afin d'éviter de trop surcharger les logs.

Pour l'instant, 9 jeux sont disponibles :
  * [Wordle](https://www.powerlanguage.co.uk/wordle/),
  * [brezhle](https://brezhle.u2042.com/),
  * [Le Mot](https://wordle.louan.me/),
  * [SUTOM](https://sutom.nocle.fr/),
  * [LeMOT](https://www.solitaire-play.com/lemot/),
  * [LeMOT6](https://www.solitaire-play.com/lemot6/),
  * [MOTDLE](https://motdle.herokuapp.com/).
  * [voxdle](https://voxdle.u2042.com/),
  * [Worldle](https://worldle.teuteuf.fr/),

Il est aussi possible d'envoyer un MP au bot pour obtenir les résultats d'un salon précis sur lequel vous êtes inscrits. Pour cela, il suffit de saisir `!recordle <NOM_DU_SALON>` où `<NOM_DU_SALON>` est le nom du salon sans `#`.

## Installation

Pour l'instant, recordle est déployé sur [Heroku](https://www.heroku.com/) en tant que processus de type worker.

Tout ce qu'il vous reste à faire est d'inviter le bot sur votre serveur en cliquant sur ce lien : https://discord.com/oauth2/authorize?client_id=937653687394897991&permissions=76800&scope=bot

Afin de fonctionner, recordle devra avoir votre autorisation pour :
  * Lire les messages,
  * Envoyer des messages,
  * Gérer les messages,
  * Voir les anciens messages

Dès que vous aurez accordé ces permissions, recordle se connectera automatiquement sur votre serveur Discord. Par défaut, il aura accès à tous les salons publics de votre serveur. Bien évidemment, vous avez la possibilité de [limiter l'accès du bot au salon sur lequel vous partagez vos résultats Wordle](https://gist.github.com/laundmo/839b74d9cbbf71f25cf772cde57bafb7).
