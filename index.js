'use strict';

const async   = require('async');
const Discord = require('discord.js');

const BOT_NAME = 'recordle';
const SCORE_VALUES = [0, 100, 50, 25, 10, 5, 1];

const GAME_PARSERS = [
    {prefix: 'Wordle', regex: /Wordle .*#?\d+ (.+)\/6/},
    {prefix: 'Le Mot', regex: /Le Mot .*#?\d+ (.+)\/6/},
    {prefix: 'SUTOM', regex: /SUTOM .*#?\d+ (.+)\/6/},
    {prefix: '(bêta) LeMOT', regex: /\(bêta\) LeMOT .*#?\d+ (.+)\/6/},
    {prefix: 'MOTDLE', regex: /MOTDLE .*#?\d+ - (.+)\/6/}
];
const MESSAGES_LIMIT = 50;

function getMonday() {

    var now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    var day = now.getDay();
    var diff = now.getDate() - day + (0 === day ? -6 : 1); // adjust when day is sunday
    return new Date(now.setDate(diff));
}

function formatDate(date) {
    if (!date) { return undefined; }

    var year    = date.getFullYear();
    var month   = date.getMonth() + 1;
    var day     = date.getDate();

    var str = '';

    if (10 > day) { str += '0'; }
    str += day;
    str += '/';
    if (10 > month) { str += '0'; }
    str += month;
    str += '/';
    str += year;
    str += ' ' ;

    return str;
}

const client = new Discord.Client({intents: ['GUILDS', 'GUILD_MESSAGES']});
client.on('messageCreate', function(message) {
    if (!message.content.startsWith('!recordle')) return;
    if (message.author.bot) return;

    let scoreByGames = {};
    let monday = getMonday();
    let nextMonday = new Date(monday);
    nextMonday.setDate(nextMonday.getDate() + 7);

    let messagesManager = message.channel.messages;
    let lastMessageId = message.id;
    let passedMonday = false;

    async.doWhilst(
        (callback) => {
            messagesManager.fetch({before: lastMessageId, limit: MESSAGES_LIMIT}).then(messages => {
                messages.forEach(msg => {
                    if (BOT_NAME === msg.author.username) return;

                    if (monday < msg.createdAt) {
                        msg.content.split('\n').forEach(line => {
                            let parser = GAME_PARSERS.find(parser => line.startsWith(parser.prefix));
                            if (!parser) return;

                            var score = parseInt(line.replace(parser.regex, '$1'));
                            if (isNaN(score)) {
                                score = 0;
                            }

                            var scoreGameEntries = scoreByGames[parser.prefix];
                            if (!scoreGameEntries) {
                                scoreGameEntries = [];
                                scoreByGames[parser.prefix] = scoreGameEntries;
                            }

                            var scoreGameUser = scoreGameEntries.find(entry => entry.author.username === msg.author.username);
                            if (!scoreGameUser) {
                                scoreGameUser = {author: msg.author, score: 0};
                                scoreGameEntries.push(scoreGameUser);
                            }
                            scoreGameUser.score += SCORE_VALUES[score];
                        });
                    } else {
                        passedMonday = true;
                    }
                });
                lastMessageId = messages.at(messages.size - 1).id;
                callback(null, messages.size);
            });
        },
        (size, callback) => callback(null, size === MESSAGES_LIMIT && !passedMonday),
        (err) => {
            var results = '';
            results += `Scores for the week (from ${formatDate(monday)} to ${formatDate(nextMonday)})\n`;
            results += '-----------------------\n\n';
            GAME_PARSERS.forEach((parser, idx) => {
                var scoreGameEntries = scoreByGames[parser.prefix];
                if (!scoreGameEntries || !scoreGameEntries.length) return;

                results += `${parser.prefix} :\n`;
                results += '-----------------------\n';
                scoreGameEntries.sort((a, b) => b.score - a.score);
                scoreGameEntries.forEach((entry, idx) => {
                    let emoji = ' ';
                    switch(idx) {
                        case 0: emoji = ':first_place:'; break;
                        case 1: emoji = ':second_place:'; break;
                        case 2: emoji = ':third_place:'; break;
                    }
                    results += `  ${emoji} @${entry.author.username}#${entry.author.discriminator} (${entry.score} points)\n`;
                });
                results += '\n';
            });
            message.author.send(results.slice(0, -1));
        }
    );
});
client.login(process.env.BOT_TOKEN);


// vim: set ts=4 sw=4 expandtab:
