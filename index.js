'use strict';

const async   = require('async');
const Discord = require('discord.js');

const BOT_NAME = 'recordle';
const SCORE_VALUES = [0, 100, 50, 25, 10, 5, 1];

const GAME_PARSERS = [
    {prefix: 'Wordle', regex: /Wordle .*#?\d+ (.+)\/6/, url: 'https://www.powerlanguage.co.uk/wordle/'},
    {prefix: 'brezhle', regex: /brezhle .*#?\d+ (.+)\/6/, url: 'https://brezhle.u2042.com/'},
    {prefix: 'Le Mot', regex: /Le Mot .*#?\d+ (.+)\/6/, url: 'https://wordle.louan.me/'},
    {prefix: 'SUTOM', regex: /SUTOM .*#?\d+ (.+)\/6/, url: 'https://sutom.nocle.fr/'},
    {prefix: 'LeMOT', regex: /LeMOT .*#?\d+ (.+)\/6/, url: 'https://www.solitaire-play.com/lemot/'},
    {prefix: 'MOTDLE', regex: /MOTDLE .*#?\d+ - (.+)\/6/, url: 'https://motdle.herokuapp.com/'},
    {prefix: 'voxdle \ud83c\uddeb\ud83c\uddf7', regex: /voxdle \ud83c\uddeb\ud83c\uddf7 .*#?\d+ (.+)\/6/, url: 'https://voxdle.u2042.com/'},
    {prefix: 'voxdle \ud83c\uddec\ud83c\udde7', regex: /voxdle \ud83c\uddec\ud83c\udde7.*#?\d+ (.+)\/6/, url: 'https://voxdle.u2042.com/'},
    {prefix: '#Worldle', regex: /Worldle .*#?\d+ (.+)\/6/, url: 'https://worldle.teuteuf.fr/'}
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

function formatError(str) {
    return `\`\`\`diff\n- ${str}\n\`\`\``;
}

function formatWeeklyRecords(author, records) {
    var results = '';
    results += `Scores for the week on <#${records.channel.id}> (from ${formatDate(records.from)} to ${formatDate(records.to)})\n\n`;

    var hasWonOnce = false;

    // TODO(msoula): adapt message to the channel's guild locale

    if (Object.keys(records.byGames).length) {
        GAME_PARSERS.forEach((parser, idx) => {
            var scoreGameEntries = records.byGames[parser.prefix];
            if (!scoreGameEntries || !scoreGameEntries.length) return;

            results += `***${parser.prefix}*** (<${parser.url}>) :\n`;
            scoreGameEntries.sort((a, b) => b.score - a.score);
            scoreGameEntries.forEach((entry, idx) => {
                let emoji = ' ';
                switch(idx) {
                    case 0: emoji = ':first_place:'; break;
                    case 1: emoji = ':second_place:'; break;
                    case 2: emoji = ':third_place:'; break;
                }
                if (entry.author.id === author.id) {
                    results += `  ${emoji} <@${entry.author.id}> (${entry.score} points)\n`;
                } else {
                    results += `  ${emoji} ${entry.author.username} (${entry.score} points)\n`;
                }

                hasWonOnce |= 0 === idx && entry.author.id === author.id;
            });
            results += '\n';
        });
    } else {
        results += `___No wordle party played___\n`;
    }

    if (hasWonOnce) {
        results += 'You are a real hero !!!!\n'
    }

    return results.slice(0, -1);
}

function getWeeklyRecordsFromChannel(channel, from, to, callback) {

    let messagesManager = channel.messages;
    let passedMonday = false;
    let lastMessageId;

    let weeklyScores = {
        channel: channel,
        from: from,
        to  : to,
        byGames: {}
    };

    async.doWhilst(
        (callback) => {
            messagesManager.fetch({before: lastMessageId, limit: MESSAGES_LIMIT}).then(messages => {
                messages.forEach(message => {
                    if (BOT_NAME === message.author.username) return;

                    if (from < message.createdAt) {
                        message.content.split('\n').forEach(line => {
                            let parser = GAME_PARSERS.find(parser => line.startsWith(parser.prefix));
                            if (!parser) return;

                            var score = 0;

                            var match = parser.regex.exec(line);
                            if (1 < match.length) {
                                score = parseInt(match[1]);
                                if (isNaN(score)) {
                                    score = 0;
                                }
                            }
                            // clamp score
                            score = Math.min(Math.max(0, score), 6);

                            var scoreGameEntries = weeklyScores.byGames[parser.prefix];
                            if (!scoreGameEntries) {
                                scoreGameEntries = [];
                                weeklyScores.byGames[parser.prefix] = scoreGameEntries;
                            }

                            var scoreGameUser = scoreGameEntries.find(entry => entry.author.username === message.author.username);
                            if (!scoreGameUser) {
                                scoreGameUser = {author: message.author, score: 0};
                                scoreGameEntries.push(scoreGameUser);
                            }
                            scoreGameUser.score += SCORE_VALUES[score];
                        });
                    } else {
                        passedMonday = true;
                    }
                });

                if (0 < messages.size) {
                    lastMessageId = messages.at(messages.size - 1).id;
                }
                callback(null, messages.size);
            });
        },
        (size, callback) => callback(null, size === MESSAGES_LIMIT && !passedMonday),
        (err) => callback(err, weeklyScores)
    );
}

function getWeeklyRecordsFromChannels(channels, callback) {
    let results = [];

    let monday = getMonday();
    let nextMonday = new Date(monday);
    nextMonday.setDate(nextMonday.getDate() + 7);

    async.each(channels, (channel, callback) => {
        getWeeklyRecordsFromChannel(channel, monday, nextMonday, (err, result) => {
            if (err) { return callback(err); }
            results.push(result);
            callback();
        });
    }, (err) => callback(err, results));
}

const client = new Discord.Client({
    // partial configuration required to enable direct messages
    partials: ["CHANNEL", "MESSAGE"],
    intents: ['GUILDS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES']
});
client.on('messageCreate', function(message) {
    if (!message.content.toLowerCase().startsWith('!recordle')) return;
    if (message.author.bot) return;

    let deleteMessage = false;

    if ('DM' === message.channel.type) {
        // check command is valid
        var command = message.content.toLowerCase().trim();
        if (!/^!recordle [^\s]+$/.test(command)) {
            return message.author.send(formatError('Sorry, invalid syntax (you should use `!recordle channel_name`)'));
        }

        // find channels by name
        let channel_name = command.replace(/^!recordle ([^\s]+)$/, '$1');
        let channels_found = client.channels.cache.filter(channel => 'GUILD_TEXT' === channel.type && channel.name.toLowerCase() === channel_name);

        // assert author belongs to guild of the channel
        let channels = [];
        async.each(channels_found.values(), (channel, callback) => {
            channel.guild.members.fetch(message.author.id)
            .then(member => {
                if (member) {
                    channels.push(channel);
                }
                callback(null);
            })
            .catch(err => {
                if (404 !== err.httpStatus) { return callback(err); }
                callback(null);
            });
        }, (err) => {
            if (err) {
                console.error(err);
                return message.author.send(formatError(`Sorry, cannot get weekly record from channels named ${channel_name}`));
            }
            if (!channels.length) {
                return message.author.send(formatError(`Sorry, you're not registered on any channel named ${channel_name}`));
            }

            getWeeklyRecordsFromChannels(channels, (err, results) => {
                if (err) {
                    return message.author.send(formatError(`Sorry, cannot get weekly record from channels named ${channel_name}`));
                }

                results.forEach(entry => message.author.send(formatWeeklyRecords(message.author, entry)));
            });
        });

    } else {
        getWeeklyRecordsFromChannels([message.channel], (err, results) => {
            if (err) {
                console.error(err);
                return message.author.send(formatError(`Sorry, cannot get weekly record from channel <#${message.channel.name}>`));
            }

            results.forEach(entry => message.author.send(formatWeeklyRecords(message.author, entry)));

            // delete the message from channel
            message.delete().then(() => {}).catch(console.error);
        });
    }

});
client.login(process.env.BOT_TOKEN);

// vim: set ts=4 sw=4 expandtab:
