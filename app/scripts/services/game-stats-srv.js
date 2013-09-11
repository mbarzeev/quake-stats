/**
 * Processes log into game stats
 */

'use strict';

angular.module('quakeStatsApp').service('GameStatsService', ['$http', 'Constants', 'MapConstants', 'UtilitiesService',
    function ($http, Constants, MapConstants, UtilitiesService) {
        this.blueFlagStatus = Constants.FLAG_STATUS_IN_BASE;
        this.redFlagStatus = Constants.FLAG_STATUS_IN_BASE;
        this.playerHoldingRedFlagID = -1;
        this.playerHoldingBlueFlagID = -1;
        this.games = [];
        var me = this;

        this.getAllGames = function (log) {
            var line;
            this.games = [];
            
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
                score = {};

            // Reset the game states
            me.resetFlagsStates();

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
                    console.log(game.name);
                }

                if (record.indexOf(Constants.PLAYER_INFO_KEY) !== -1) {
                    players[me.getPlayerObject(record).id] = me.getPlayerObject(record);
                }

                // Flags
                if (record.indexOf('team_CTF_') !== -1) {
                    var flag = me.getFlagObject(record, players);
                    if (flag.action === 'scored!') {
                        score[flag.color] += 1;
                    }
                    flags.push(flag);
                }

                // Exit
                if (record.indexOf('Exit:') !== -1) {
                    // The next line states the score of this game. Let's parse it...
                    me.getGameScore(log[i + 1]);
                    // if the game end due to time limit, and the scores don't match it is a sudden death
                    // Resolve the winning team and give credit to the last player who fetched the flag for 
                }

                // MOD_SUICIDE
                // TODO: Needs some serous refactoring since it is coded like... crap
                if (record.indexOf('Kill:') !== -1 && record.indexOf(' 20: ') !== -1) {
                    // If the player holding the flag committed suicide, then the flag returns to his enemy's base
                    var playerID = parseInt(record.slice(record.indexOf('Kill:') + 'Kill:'.length, record.indexOf(' 20: ')), 10);
                    if (playerID === me.playerHoldingBlueFlagID) {
                        me.playerHoldingBlueFlagID = -1;
                        me.blueFlagStatus = Constants.FLAG_STATUS_IN_BASE;
                    }
                    if (playerID === me.playerHoldingRedFlagID) {
                        me.playerHoldingRedFlagID = -1;
                        me.redFlagStatus = Constants.FLAG_STATUS_IN_BASE;
                    }
                }

                // MOD_TRIGGER_HURT
                // TODO: Needs some serous refactoring since it is coded like... crap
                /*if (record.indexOf('Kill:') !== -1 && record.indexOf(' 22: ') !== -1) {
                    // If the player holding the flag was killed by the world, then the flag returns to his enemy's base
                    var playerID = parseInt(record.slice(record.indexOf('Kill: 1022 ') + 'Kill: 1022 '.length, record.indexOf(' 22: ')));

                    if (playerID === me.playerHoldingBlueFlagID) {
                        console.log('world killed Blue carrier', playerID)
                        me.playerHoldingBlueFlagID = -1;
                        me.blueFlagStatus = Constants.FLAG_STATUS_IN_BASE; 
                    }
                    if (playerID === me.playerHoldingRedFlagID) {
                        console.log('world killed Red carrier', playerID)
                        me.playerHoldingRedFlagID = -1;
                        me.redFlagStatus = Constants.FLAG_STATUS_IN_BASE; 
                    }
                }*/

                // MOD_FALLING
                // TODO: Needs some serous refactoring since it is coded like... crap
                /*if (record.indexOf('Kill:') !== -1 && record.indexOf(' 19: ') !== -1) {
                    // If the player holding the flag was killed by the world, then the flag returns to his enemy's base
                    var playerID = parseInt(record.slice(record.indexOf('Kill: 1022 ') + 'Kill: 1022 '.length, record.indexOf(' 19: ')));

                    if (playerID === me.playerHoldingBlueFlagID) {
                        console.log('world killed Blue carrier', playerID)
                        me.playerHoldingBlueFlagID = -1;
                        me.blueFlagStatus = Constants.FLAG_STATUS_IN_BASE; 
                    } 
                    if (playerID === me.playerHoldingRedFlagID) {
                        console.log('world killed Red carrier', playerID)
                        me.playerHoldingRedFlagID = -1;
                        me.redFlagStatus = Constants.FLAG_STATUS_IN_BASE; 
                    }
                }*/

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
            var best = null,
                player = null;
            for (var item in players) {
                player = players[item];
                if (best === null) {
                    best = player;
                    continue;
                }
                if (player[prop] > best[prop]) {
                    best = player;
                }
            }
            return best;
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
                    me.playerHoldingRedFlagID = player.id;
                    player.fetchedFlags += 1;
                    return 'fetched';
                }
                if (me.redFlagStatus === Constants.FLAG_STATUS_FETCHED) {
                    player.reboundedFlags += 1;
                    me.playerHoldingRedFlagID = player.id;
                    return 'rebounded';
                }
            } else if (player.team === 1) {
                if (me.redFlagStatus === Constants.FLAG_STATUS_IN_BASE) {
                    me.resetFlagsStates();
                    player.scoredFlags += 1;
                    return 'scored!';
                }
                if (me.redFlagStatus === Constants.FLAG_STATUS_FETCHED) {
                    me.redFlagStatus = Constants.FLAG_STATUS_IN_BASE;
                    me.playerHoldingRedFlagID = -1;
                    player.restoredFlags += 1;
                    return 'restored';
                }
            }
        };

        this.getBlueFlagAction = function (record, player) {
            if (player.team === 1) {
                if (me.blueFlagStatus === Constants.FLAG_STATUS_IN_BASE) {
                    me.blueFlagStatus = Constants.FLAG_STATUS_FETCHED;
                    me.playerHoldingBlueFlagID = player.id;
                    player.fetchedFlags += 1;
                    return 'fetched';
                }
                if (me.blueFlagStatus === Constants.FLAG_STATUS_FETCHED) {
                    me.playerHoldingBlueFlagID = player.id;
                    player.reboundedFlags += 1;
                    return 'Rebounded';
                }
            } else if (player.team === 2) {
                if (me.blueFlagStatus === Constants.FLAG_STATUS_IN_BASE) {
                    me.resetFlagsStates();
                    player.scoredFlags += 1;
                    return 'scored!';
                }
                if (me.blueFlagStatus === Constants.FLAG_STATUS_FETCHED) {
                    me.blueFlagStatus = Constants.FLAG_STATUS_IN_BASE;
                    me.playerHoldingBlueFlagID = -1;
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

        this.getGameScore = function(record) {
            if (record) {
                var redScore = record.substr(record.indexOf(Constants.RED_SCORE_KEY) , 7),
                    blueScore = record.substr(record.indexOf(Constants.BLUE_SCORE_KEY) , 7);
                console.log(redScore, blueScore);
            }
        };

        this.resetFlagsStates = function() {
            me.playerHoldingRedFlagID = -1;
            me.playerHoldingBlueFlagID = -1;
            me.redFlagStatus = Constants.FLAG_STATUS_IN_BASE;
            me.blueFlagStatus = Constants.FLAG_STATUS_IN_BASE;
        };
    }]);