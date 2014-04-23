'use strict';

angular.module('quakeStatsApp').service('KillsService', ['GamesLogParserService', '$cacheFactory', function(GamesLogParserService, $cacheFactory) {
	var me = this;
	var currentStats = null;
    var statsCache = $cacheFactory('killsStats');

    this.alainKills = 0;

    this.initMap = function(record, startIndex) {
        var map = {};
        map.name = GamesLogParserService.getMapId(record);
        map.startIndex = startIndex;
        map.players = {};
        return map;
    };

    this.getPlayer = function (record) {
        var player = {};

        player.id = GamesLogParserService.getPlayerId(record);
        player.name = GamesLogParserService.getPlayerName(record);
        player.nameId = player.name.replace(' ', '').toLowerCase();
        player.team = GamesLogParserService.getPlayerTeam(record);
        player.kills = [];
        player.deaths = [];
        player.humiliations = [];
        player.teammatesKills = [];
        return player;
    };
    
    this.getTopPlayers = function (prop, players) {
        var topPlayers = [],
            player = null;
        for (var playerName in players) {
            player = players[playerName];
            if (topPlayers.length > 0) {
                if (player[prop].length > topPlayers[0][prop].length) {
                    topPlayers = [player];
                } else if (player[prop].length === topPlayers[0][prop].length) {
                    topPlayers.push(player);
                }
            } else {
                topPlayers = [player];
            }
        }
        return topPlayers;
    };

    this.registerKill = function(kill, map) {
        var killerPlayer = map.players[kill.killerName],
            victimPlayer = map.players[kill.victimName];
        if (killerPlayer && victimPlayer) {
            if (kill.killerName !== kill.victimName) {
                victimPlayer.deaths.push(kill);
            }
            if (killerPlayer.team === victimPlayer.team) {
                currentStats.players[kill.killerName].teammatesKills.push(kill);
            } else {
                killerPlayer.kills.push(kill);
                if (kill.mode === 2) {
                    currentStats.players[kill.killerName].humiliations.push(kill);
                }
            }
            calculatePlayerToPlayerKills(kill);
        }
    };

    function calculatePlayerToPlayerKills(kill) {
        var killerPlayer = currentStats.players[kill.killerName],
            victimPlayer = currentStats.players[kill.victimName];
        if (killerPlayer && victimPlayer) {
            if (kill.killerName !== kill.victimName) {
                victimPlayer.deaths.push(kill);
            }
            if (killerPlayer.team !== victimPlayer.team) {
                killerPlayer.kills.push(kill);
            }
        }
    }

    this.registerStatsPlayer = function(player) {
        if (!currentStats.players[player.name]) {
            currentStats.players[player.name] = angular.copy(player);
        }
        if (currentStats.players[player.name].team !== player.team) {
            currentStats.players[player.name].team = player.team;
        }
    };

	this.getKillsStats = function(log, gameId) {
        var statsFromCache = statsCache.get(gameId);
		if (statsFromCache) {
            currentStats = statsFromCache;
            return statsFromCache;
        }
        var i,
            record,
            map,
            kill,
            player;
        currentStats = {};
        currentStats.maps = {};
        currentStats.players = {};

        for (i = 0; i < log.length; i++) {
            record = log[i];
            if (!record) {
                continue;
            }
            if (GamesLogParserService.isMapStart(record)) {
                map = me.initMap(record, i);
                currentStats.maps[i] = map;
            }
            // Player
            if (GamesLogParserService.isClientUserinfoChanged(record)) {
                player = me.getPlayer(record);

                for (var name in map.players) {
                    if (map.players[name] && map.players[name].name === player.name) {
                        delete map.players[name];
                        break;
                    }
                }
                map.players[player.name] = player;
                me.registerStatsPlayer(player);
            }
            // Kill
            if (GamesLogParserService.isKill(record)) {
                kill = GamesLogParserService.getKillObj(record);
                if (kill.victim !== kill.killer) {
                    me.registerKill(kill, map);
                }
            }
            // Exit
            if (GamesLogParserService.isShutdown(record)) {
                map.topKillers = me.getTopPlayers('kills', map.players);
                map.topVictims = me.getTopPlayers('deaths', map.players);
            }
        }
        currentStats.topKillers = me.getTopPlayers('kills', currentStats.players);
        currentStats.topVictims = me.getTopPlayers('deaths', currentStats.players);
        currentStats.topHumilators = me.getTopPlayers('humiliations', currentStats.players);
        currentStats.topFifthColumns = me.getTopPlayers('teammatesKills', currentStats.players);
        currentStats.humiliations = getAggragatedArraysByProp('humiliations', currentStats.players);
        currentStats.teammatesKills = getAggragatedArraysByProp('teammatesKills', currentStats.players);

        statsCache.put(gameId, currentStats);
        return currentStats;
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