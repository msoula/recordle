<img align="right" src="https://i.imgur.com/0CLSbGS.png" height="200" width="200">

# Recordle

Recordle is a bot that weekly reports Wordle-like games scores shared on a Discord channel.

Just type `!recordle` in the channel and get results!


For now, 5 games are available:
  * [Wordle](https://www.powerlanguage.co.uk/wordle/),
  * [Le Mot](https://wordle.louan.me/),
  * [SUTOM](https://sutom.nocle.fr/),
  * [LeMOT](https://www.solitaire-play.com/lemot/),
  * [MOTDLE](https://motdle.herokuapp.com/).

## Setup

For now, recordle is hosted on [Heroku](https://www.heroku.com/) as a worker process.

All you have to do is to invite the bot on your server by clicking on this link: https://discord.com/oauth2/authorize?client_id=937653687394897991&permissions=76800&scope=bot

In order to work, recordle has to have access to the following permissions:
  * Read messages / view channels,
  * Send messages,
  * Manage messages,
  * Read message history

Once you've accepted these permissions, recordle will automatically log onto your discord server. By default, it will access all the public channels of your server. Of course, you've got the possibility to [restrict the bot to the channel you use to share your wordle scores](https://gist.github.com/laundmo/839b74d9cbbf71f25cf772cde57bafb7).
