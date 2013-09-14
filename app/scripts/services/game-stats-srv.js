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
        this.blueFlagAbandonTime = -1;
        this.redFlagAbandonTime = -1;
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
            me.resetAllFlags();

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
                    var playerObj = me.getPlayerObject(record);
                    var id = playerObj.id;
                    players[id] = playerObj;
                }

                // Check for abandoned flags
                if (me.blueFlagAbandonTime !== -1 && (me.getRecordTime(record) - me.blueFlagAbandonTime) >= Constants.FLAG_ABONDON_TIME_LIMIT) {
                    console.log('reseting blue');
                    me.resetBlueFlag();
                }
                if (me.redFlagAbandonTime !== -1 && (me.getRecordTime(record) - me.redFlagAbandonTime) >= Constants.FLAG_ABONDON_TIME_LIMIT) {
                    console.log('reseting red');
                    me.resetRedFlag();
                }

                // Flags
                if (record.indexOf('team_CTF_') !== -1) {
                    var flag = me.getFlagObject(record, players, i);
                    if (flag.action === 'scored!') {
                        score[flag.color] += 1;
                    }
                    flags.push(flag);
                }

                // Exit
                if (record.indexOf('Exit:') !== -1) {
                    // The next line states the score of this game. Let's parse it...
                    game.logScore = me.getGameScore(log[i + 1]);
                    console.log(i, game.name, '-',  game.logScore);
                }

                // Kill
                if (record.indexOf('Kill: ') !== -1) {
                    me.handleKills(record);
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

        this.getRecordTime = function(record) {
            var timeStr = record.slice(0, record.indexOf(':' ) + 3),
                timeArr = timeStr.split(':'),
                minutes = parseInt(timeArr[0], 10),
                seconds = parseInt(timeArr[1], 10);

            return (minutes * 60) + seconds;
        };

        this.handleKills = function(record) {
            var killStr = record.slice(record.indexOf('Kill: ') + 'Kill: '.length, record.indexOf(':', record.indexOf('Kill: ') + 'Kill: '.length)),
                idsArr = killStr.split(' '),
                killerID = parseInt(idsArr[0], 10),
                victimID = parseInt(idsArr[1], 10),
                killModeID = parseInt(idsArr[2], 10),
                time = me.getRecordTime(record);

            switch(killModeID) {
            case 20:
            case 22:
                me.handleSuicide(victimID);
                break;
            default:
                me.handleOrdinaryKills(time, killerID, victimID);
                break;
            }
        };

        this.handleSuicide = function(victimID) {
            // If the player holding the flag was killed by the world, 
            // then the flag returns to his enemy's base
            if (victimID === me.playerHoldingBlueFlagID) {
                me.resetBlueFlag();
            }
            if (victimID === me.playerHoldingRedFlagID) {
                me.resetRedFlag();
            }
            // LOOKUOT! These following log line indicate the player 5 fetched the
            // Flag, but when he fell, the flag was probably not resotred to base.
            /*
            32:39 Item: 5 team_CTF_redflag
            32:39 Item: 5 weapon_shotgun
            32:40 Item: 0 item_health_large
            32:40 Item: 3 weapon_railgun
            32:42 Item: 0 item_health_large
            32:43 Kill: 1022 6 22: <world> killed Casper by MOD_TRIGGER_HURT
            32:44 Item: 0 item_armor_combat
            32:44 Item: 4 item_armor_combat
            32:45 Kill: 0 2 6: Federation killed Chernilb by MOD_ROCKET
            32:45 Kill: 1022 5 22: <world> killed Yourself by MOD_TRIGGER_HURT
            */
        };

        this.handleOrdinaryKills = function(time, killerID, victimID) {
            if (victimID === me.playerHoldingBlueFlagID) {
                me.blueFlagAbandonTime = time;
                me.playerHoldingBlueFlagIDc = -1;
            }
            if (victimID === me.playerHoldingRedFlagID) {
                me.redFlagAbandonTime = time;
                me.playerHoldingRedFlagIDc = -1;
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

        this.getFlagObject = function (record, players, index) {
            var flag = {};
            var idStr = record.slice(record.indexOf('Item: ') + 6, record.indexOf('team_CTF_'));
            var playerId = parseInt(idStr, 10);
            var player = players[playerId];

            if (player) {
                flag.record = record;
                flag.player = player;
                flag.index = index + 1;
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
            if (player.team === Constants.BLUE) {
                if (me.redFlagStatus === Constants.FLAG_STATUS_IN_BASE) {
                    me.redFlagStatus = Constants.FLAG_STATUS_FETCHED;
                    me.playerHoldingRedFlagID = player.id;
                    player.fetchedFlags += 1;
                    return 'fetched';
                }
                if (me.redFlagStatus === Constants.FLAG_STATUS_FETCHED) {
                    player.reboundedFlags += 1;
                    me.redFlagAbandonTime = -1;
                    me.playerHoldingRedFlagID = player.id;
                    return 'rebounded';
                }
            }
            if (player.team === Constants.RED) {
                if (me.redFlagStatus === Constants.FLAG_STATUS_IN_BASE) {
                    me.resetAllFlags();
                    player.scoredFlags += 1;
                    return 'scored!';
                }
                if (me.redFlagStatus === Constants.FLAG_STATUS_FETCHED) {
                    me.resetRedFlag();
                    player.restoredFlags += 1;
                    return 'restored';
                }
            }
        };

        this.getBlueFlagAction = function (record, player) {
            if (player.team === Constants.RED) {
                if (me.blueFlagStatus === Constants.FLAG_STATUS_IN_BASE) {
                    me.blueFlagStatus = Constants.FLAG_STATUS_FETCHED;
                    me.playerHoldingBlueFlagID = player.id;
                    player.fetchedFlags += 1;
                    return 'fetched';
                }
                if (me.blueFlagStatus === Constants.FLAG_STATUS_FETCHED) {
                    me.playerHoldingBlueFlagID = player.id;
                    me.blueFlagAbandonTime = -1;
                    player.reboundedFlags += 1;
                    return 'Rebounded';
                }
            }
            if (player.team === Constants.BLUE) {
                if (me.blueFlagStatus === Constants.FLAG_STATUS_IN_BASE) {
                    me.resetAllFlags();
                    player.scoredFlags += 1;
                    return 'scored!';
                }
                if (me.blueFlagStatus === Constants.FLAG_STATUS_FETCHED) {
                    me.resetBlueFlag();
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
            // TODO: Refactor, this is not the way to extract these numbers
            if (record) {
                var redScore = record.substr(record.indexOf(Constants.RED_SCORE_KEY) , 7),
                    blueScore = record.substr(record.indexOf(Constants.BLUE_SCORE_KEY) , 7);
                return {
                    redScore: parseInt(redScore.replace(Constants.RED_SCORE_KEY, '', 'gi'), 10),
                    blueScore: parseInt(blueScore.replace(Constants.BLUE_SCORE_KEY, '', 'gi'), 10)
                };
            }
        };

        this.resetAllFlags = function() {
            me.resetRedFlag();
            me.resetBlueFlag();
        };

        this.resetBlueFlag = function() {
            me.playerHoldingBlueFlagID = -1;
            me.blueFlagStatus = Constants.FLAG_STATUS_IN_BASE;
            me.blueFlagAbandonTime = -1;
        };

        this.resetRedFlag = function() {
            me.playerHoldingRedFlagID = -1;
            me.redFlagStatus = Constants.FLAG_STATUS_IN_BASE;
            me.redFlagAbandonTime = -1;
        };
    }]);