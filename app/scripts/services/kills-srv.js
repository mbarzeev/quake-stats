'use strict';

angular.module('quakeStatsApp').service('KillsService', ['Constants', function(Constants) {
	this.stats = null;
    this.alainKills = 0;
	var me = this;

    this.initMap = function(record, startIndex) {
        var map = {};
        map.name = me.getMapKey(record);
        map.startIndex = startIndex;
        map.players = {};
        return map;
    };

    this.getMapKey = function(record) {
        var startIndex = record.indexOf(Constants.MAP_NAME_KEY) + Constants.MAP_NAME_KEY.length,
            endIndex = record.indexOf(Constants.BACKSLASH_KEY, startIndex);
        return record.slice(startIndex, endIndex);
    };

    this.getPlayer = function (record) {
        var player = {},
            teamStr = record.substr(record.indexOf(Constants.TEAM_NUM_KEY) + Constants.TEAM_NUM_KEY.length, 1);

        player.id = me.getPlayerID(record);
        player.name = me.getPlayerName(record);
        player.nameId = me.getPlayerName(record).replace(' ', '').toLowerCase();
        player.team = parseInt(teamStr, 10);
        player.kills = [];
        player.deaths = [];
        player.humiliations = [];
        player.teammatesKills = [];
        return player;
    };

    this.getPlayerID = function(record) {
        var idStr = record.slice(record.indexOf(Constants.PLAYER_INFO_KEY) + Constants.PLAYER_INFO_KEY.length, record.indexOf(Constants.PLAYER_NAME_KEY));
        return parseInt(idStr, 10);
    };

    this.getPlayerName = function(record) {
        return record.slice(record.indexOf(Constants.PLAYER_NAME_KEY) + Constants.PLAYER_NAME_KEY.length, record.indexOf(Constants.BACKSLASH_KEY, record.indexOf(Constants.PLAYER_NAME_KEY) + Constants.PLAYER_NAME_KEY.length));
    };

    this.getKill = function(record) {
        var killStr = record.slice(record.indexOf('Kill: ') + 'Kill: '.length, record.indexOf(':', record.indexOf('Kill: ') + 'Kill: '.length)),
            idsArr = killStr.split(' '),
            killerID = parseInt(idsArr[0], 10),
            victimID = parseInt(idsArr[1], 10),
            killModeID = parseInt(idsArr[2], 10),
            killerName = record.slice(record.indexOf(killStr + ': ') + (killStr + ': ').length, record.indexOf(' killed')),
            victimName = record.slice(record.indexOf('killed ') + 'killed '.length, record.indexOf(' by'));
        return {killer: killerID,
            killerName:killerName,
            victim: victimID,
            victimName: victimName,
            mode: killModeID
        };
    };

    this.getTopPlayer = function(prop, players) {
        var topPlayer = null,
            player = null;
        for (var playerName in players) {
            player = players[playerName];
            if (topPlayer) {
                if (player[prop].length > topPlayer[prop].length) {
                    topPlayer = player;
                }
            } else {
                topPlayer = player;
            }
        }
        return topPlayer;
    };

    this.registerKill = function(kill, map) {
        var killerPlayer = map.players[kill.killerName],
            victimPlayer = map.players[kill.victimName];
        if (killerPlayer && victimPlayer) {
            killerPlayer.kills.push(kill);
            victimPlayer.deaths.push(kill);
            if (killerPlayer.team === victimPlayer.team) {
                me.stats.players[kill.killerName].teammatesKills.push(kill);
            } else if (kill.mode === 2) {
                me.stats.players[kill.killerName].humiliations.push(kill);
            }
            calculatePlayerToPlayerKills(kill);
        }
    };

    function calculatePlayerToPlayerKills(kill) {
        var killerPlayer = me.stats.players[kill.killerName],
            victimPlayer = me.stats.players[kill.victimName];
        if (killerPlayer && victimPlayer) {
            killerPlayer.kills.push(kill);
            victimPlayer.deaths.push(kill);
        }
    }

    this.registerStatsPlayer = function(player) {
        if (!me.stats.players[player.name]) {
            me.stats.players[player.name] = player;
        }
        if (me.stats.players[player.name].team !== player.team) {
            me.stats.players[player.name].team = player.team;
        }
    };

	this.getKillsStats = function(log) {
		if (me.stats) {
            return me.stats;
        }
        var i,
            record,
            map,
            kill,
            player;
        me.stats = {};
        me.stats.maps = {};
        me.stats.players = {};

        for (i = 0; i < log.length; i++) {
            record = log[i];
            if (record.indexOf('InitGame:') !== -1) {
                map = me.initMap(record, i);
                me.stats.maps[i] = map;
            }
            // Player
            if (record.indexOf(Constants.PLAYER_INFO_KEY) !== -1) {
                player = me.getPlayer(record);

                for (var name in map.players) {
                    if (map.players[name] && map.players[name].name === player.name) {
                        player = angular.copy(map.players[name]);
                        delete map.players[name];
                        break;
                    }
                }
                map.players[player.name] = player;
                me.registerStatsPlayer(player);
            }
            // Kill
            if (record.indexOf('Kill: ') !== -1) {
                kill = me.getKill(record);
                if (kill.victim !== kill.killer) {
                    me.registerKill(kill, map);
                }
            }
            // Exit
            if (record.indexOf('ShutdownGame:') !== -1) {
                map.topKiller = me.getTopPlayer('kills', map.players);
                map.topVictim = me.getTopPlayer('deaths', map.players);
            }
        }
        me.stats.topKiller = me.getTopPlayer('kills', me.stats.players);
        me.stats.topVictim = me.getTopPlayer('deaths', me.stats.players);
        me.stats.topHumilator = me.getTopPlayer('humiliations', me.stats.players);
        me.stats.topFifthColumn = me.getTopPlayer('teammatesKills', me.stats.players);
        me.stats.humiliations = getAggragatedArraysByProp('humiliations', me.stats.players);
        me.stats.teammatesKills = getAggragatedArraysByProp('teammatesKills', me.stats.players);
        return me.stats;
	};

    this.getPlayerWeaponsStats = function(player) {
        var modes=  {},
            result = [],
            killMode,
            deathMode;
        if (player) {
            for (var kill in player.kills) {
                killMode = player.kills[kill].mode;
                if (modes[killMode] === undefined) {
                    modes[killMode] = {id:killMode, kills:0, deaths:0};
                    continue;
                } else {
                    modes[killMode].kills += 1;
                }
            }
            for (var death in player.deaths) {
                deathMode = player.deaths[death].mode;
                if (modes[deathMode] === undefined) {
                    modes[deathMode] = {id:deathMode, kills:0, deaths:0};
                    continue;
                } else {
                    modes[deathMode].deaths += 1;
                }
            }

            for (var mode in modes) {
                result.push(modes[mode]);
            }
        }
        return result;
    };

    function getAggragatedArraysByProp(prop, players) {
        var result = [],
            player,
            killer,
            kill,
            aggregator;
        for (var item in players) {
            aggregator = {};
            player = players[item];
            if (player[prop].length > 0) {
                killer = {
                    name: player.name,
                    nameId: player.nameId,
                    count: player[prop].length,
                    victims: []
                };
                for (var i = 0; i < player[prop].length; i++) {
                    kill = player[prop][i];
                    if (!aggregator[kill.victimName]) {
                        aggregator[kill.victimName] = {name:kill.victimName, count:0};
                    }
                    aggregator[kill.victimName].count++;
                }
                killer.victims = objectToArray(aggregator);
                result.push(killer);
            }
        }
        return result;
    }

    function objectToArray(items) {
        var result = [];
        angular.forEach(items, function(value) {
            result.push(value);
        });
        return result;
    }
}]);