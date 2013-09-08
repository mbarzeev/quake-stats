/**
 * Processes log into game stats
 */

'use strict';

angular.module('quakeStatsApp').service('GameStatsService', ['$http', 'Constants', 'MapConstants', 'UtilitiesService',
    function ($http, Constants, MapConstants, UtilitiesService) {
        this.blueFlagStatus = Constants.FLAG_STATUS_IN_BASE;
        this.redFlagStatus = Constants.FLAG_STATUS_IN_BASE;
        this.games = [];
        var me = this;

        this.getAllGames = function (log) {
            var line;
            this.games = [];
            // FIXME: Remove suplicated loop (below)
            for (var index in log) {
                line = log[index];
                if (line.indexOf('InitGame:') !== -1) {
                    me.games.push(me.getGame(log, index));
                }
            }
            return me.games;
        };

        this.getGame = function (log, index) {
            var game = {},
                record = null,
                players = {},
                flags = [],
//            redTeam = [],
//            blueTeam = [],
                score = {};
//            bestScorer = null,
//            bestFetcher = null,
//            bestRebounder = null,
//            bestRestorer = null;

            score[Constants.RED] = 0;
            score[Constants.BLUE] = 0;
            me.redFlagStatus = Constants.FLAG_STATUS_IN_BASE;
            me.blueFlagStatus = Constants.FLAG_STATUS_IN_BASE;

            for (var i = index; i < log.length; i++) {
                record = log[i];
                if (i === index) {
                    var startIndex = record.indexOf(Constants.MAP_NAME_KEY) + Constants.MAP_NAME_KEY.length,
                        endIndex = record.indexOf(Constants.BACKSLASH_KEY, startIndex),
                        key = record.slice(startIndex, endIndex);
                    game.name = me.getGameName(key.toLowerCase());
                    game.recordIndex = index;
                }

                if (record.indexOf(Constants.PLAYER_INFO_KEY) !== -1) {
                    players[me.getPlayerObject(record).id] = me.getPlayerObject(record);
                }

                // Flags
                if (record.indexOf('team_CTF_') !== -1) {
                    var flag = me.getFlagObject(record, players);
                    if (flag.action === 'scored!') {
                        if (flag.color === Constants.RED) {
                            score[Constants.RED] += 1;
                        }
                        if (flag.color === Constants.BLUE) {
                            score[Constants.BLUE] += 1;
                        }
                    }
                    flags.push(flag);
                }

                // ShutdownGame
                if (record.indexOf('ShutdownGame') !== -1) {
                    game.players = players;
                    game.flags = flags;
                    game.score = score;
                    game.bestScorer = me.getBest(players, 'scoredFlags');
                    game.bestFetcher = me.getBest(players, 'fetchedFlags');
                    game.bestRebounder = me.getBest(players, 'reboundedFlags');
                    game.bestRestorer = me.getBest(players, 'restoredFlags');
                    game.winner = me.getWinningTeam(game.score);
                    return game;
                }
            }
        };

        this.getWinningTeam = function (gameScore) {
            var redScore = gameScore[Constants.RED];
            var blueScore = gameScore[Constants.BLUE];
            return UtilitiesService.getWinner(redScore, blueScore);
        };

        this.getBest = function (players, prop) {
            var bestScorer = null,
                player = null;
            for (var item in players) {
                player = players[item];
                if (bestScorer === null) {
                    bestScorer = player;
                    continue;
                }
                if (player[prop] > bestScorer[prop]) {
                    bestScorer = player;
                }
            }
            return bestScorer;
        };

        this.getPlayerObject = function (record) {
            var player = {},
                idStr = record.slice(record.indexOf(Constants.PLAYER_INFO_KEY) + Constants.PLAYER_INFO_KEY.length, record.indexOf(Constants.PLAYER_NAME_KEY)),
                nameStr = record.slice(record.indexOf(Constants.PLAYER_NAME_KEY) + Constants.PLAYER_NAME_KEY.length, record.indexOf(Constants.BACKSLASH_KEY, record.indexOf(Constants.PLAYER_NAME_KEY) + Constants.PLAYER_NAME_KEY.length)),
                teamStr = record.substr(record.indexOf(Constants.TEAM_NUM_KEY) + Constants.TEAM_NUM_KEY.length, 1);

            player.id = parseInt(idStr, 10);
            player.name = nameStr;
            player.team = parseInt(teamStr, 10);
            player.fetchedFlags = 0;
            player.restoredFlags = 0;
            player.reboundedFlags = 0;
            player.scoredFlags = 0;
            return player;
        };

        this.getFlagObject = function (record, players) {
            var flag = {};
            var idStr = record.slice(record.indexOf('Item: ') + 6, record.indexOf('team_CTF_'));
            var playerId = parseInt(idStr, 10);
            var player = players[playerId];

            if (player) {
                flag.record = record;
                flag.player = player;
                if (record.indexOf('redflag') !== -1) {
                    flag.color = Constants.RED;
                    flag.action = me.getRedFlagAction(record, player);
                }
                if (record.indexOf('blueflag') !== -1) {
                    flag.color = Constants.BLUE;
                    flag.action = me.getBlueFlagAction(record, player);
                }
            }
            return flag;
        };

        this.getRedFlagAction = function (record, player) {
            if (player.team === 2) {
                if (me.redFlagStatus === Constants.FLAG_STATUS_IN_BASE) {
                    me.redFlagStatus = Constants.FLAG_STATUS_FETCHED;
                    player.fetchedFlags += 1;
                    return 'fetched';
                }
                if (me.redFlagStatus === Constants.FLAG_STATUS_FETCHED || me.redFlagStatus === Constants.FLAG_STATUS_REBOUNDED) {
                    me.redFlagStatus = Constants.FLAG_STATUS_REBOUNDED;
                    player.reboundedFlags += 1;
                    return 'rebounded';
                }
            } else if (player.team === 1) {
                if (me.redFlagStatus === Constants.FLAG_STATUS_IN_BASE) {
                    me.blueFlagStatus = Constants.FLAG_STATUS_IN_BASE;
                    player.scoredFlags += 1;
                    return 'scored!';
                }
                if (me.redFlagStatus === Constants.FLAG_STATUS_FETCHED || me.redFlagStatus === Constants.FLAG_STATUS_REBOUNDED) {
                    me.redFlagStatus = Constants.FLAG_STATUS_IN_BASE;
                    player.restoredFlags += 1;
                    return 'restored';
                }
            }
        };

        this.getBlueFlagAction = function (record, player) {
            if (player.team === 1) {
                if (me.blueFlagStatus === Constants.FLAG_STATUS_IN_BASE) {
                    me.blueFlagStatus = Constants.FLAG_STATUS_FETCHED;
                    player.fetchedFlags += 1;
                    return 'fetched';
                }
                if (me.blueFlagStatus === Constants.FLAG_STATUS_FETCHED || me.blueFlagStatus === Constants.FLAG_STATUS_REBOUNDED) {
                    me.blueFlagStatus = Constants.FLAG_STATUS_REBOUNDED;
                    player.reboundedFlags += 1;
                    return 'Rebounded';
                }
            } else if (player.team === 2) {
                if (me.blueFlagStatus === Constants.FLAG_STATUS_IN_BASE) {
                    me.redFlagStatus = Constants.FLAG_STATUS_IN_BASE;
                    player.scoredFlags += 1;
                    return 'scored!';
                }
                if (me.blueFlagStatus === Constants.FLAG_STATUS_FETCHED || me.blueFlagStatus === Constants.FLAG_STATUS_REBOUNDED) {
                    me.blueFlagStatus = Constants.FLAG_STATUS_IN_BASE;
                    player.restoredFlags += 1;
                    return 'Restored';
                }
            }
        };

        this.getGameName = function (key) {
            var name = key;
            if (MapConstants.hasOwnProperty(key)) {
                name = MapConstants[key];
            }
            return name;
        };
    }]);