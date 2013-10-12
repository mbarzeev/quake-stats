'use strict';

angular.module('quakeStatsApp').service('KillsService', ['Constants', function(Constants) {
	this.stats = null;
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
            idStr = record.slice(record.indexOf(Constants.PLAYER_INFO_KEY) + Constants.PLAYER_INFO_KEY.length, record.indexOf(Constants.PLAYER_NAME_KEY)),
            nameStr = record.slice(record.indexOf(Constants.PLAYER_NAME_KEY) + Constants.PLAYER_NAME_KEY.length, record.indexOf(Constants.BACKSLASH_KEY, record.indexOf(Constants.PLAYER_NAME_KEY) + Constants.PLAYER_NAME_KEY.length)),
            teamStr = record.substr(record.indexOf(Constants.TEAM_NUM_KEY) + Constants.TEAM_NUM_KEY.length, 1);

        player.id = parseInt(idStr, 10);
        player.name = nameStr;
        player.team = parseInt(teamStr, 10);
        player.kills = [];
        player.deaths = [];
        return player;
    };

    this.getKill = function(record) {
        var killStr = record.slice(record.indexOf('Kill: ') + 'Kill: '.length, record.indexOf(':', record.indexOf('Kill: ') + 'Kill: '.length)),
            idsArr = killStr.split(' '),
            killerID = parseInt(idsArr[0], 10),
            victimID = parseInt(idsArr[1], 10),
            killModeID = parseInt(idsArr[2], 10);
        return {killer: killerID,
            victim: victimID,
            mode: killModeID};
    };

    this.getTopPlayer = function(prop, map) {
        var topPlayer = null,
            player = null;
        for (var playerName in map.players) {
            player = map.players[playerName];
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

    this.getOverallTopPlayer = function(prop, maps) {
        var map,
            players = {},
            topPlayer;
        for (var mapIndex in maps) {
            map = maps[mapIndex];
            for (var playerID in map.players) {
                if (players[playerID] === undefined) {
                    players[playerID] = 0;
                }
                players[playerID] += map.players[playerID][prop].length;
                
                if (topPlayer) {
                    if (players[playerID] > topPlayer.value) {
                        topPlayer = {name:map.players[playerID].name, value:players[playerID]};
                    }
                } else {
                    topPlayer = {name:map.players[playerID].name, value:players[playerID]};
                }
            }
        }
        return topPlayer;
    };

    this.registerKill = function(kill, map) {
        var killerPlayer = map.players[kill.killer],
            victimPlayer = map.players[kill.victim];
        if (killerPlayer) {
            if (kill.mode !== Constants.MOD_SUICIDE) {
                killerPlayer.kills.push(kill);
            }
        }
        if (victimPlayer) {
            victimPlayer.deaths.push(kill);
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

        for (i = 0; i < log.length; i++) {
            record = log[i];
            if (record.indexOf('InitGame:') !== -1) {
                map = me.initMap(record, i);
                me.stats.maps[i] = map;
            }
            // Player
            if (record.indexOf(Constants.PLAYER_INFO_KEY) !== -1) {
                var player = me.getPlayer(record);
                map.players[player.id] = player;
            }
            // Kill
            if (record.indexOf('Kill: ') !== -1) {
                kill = me.getKill(record);
                me.registerKill(kill, map);
                
            }
            // Exit
            if (record.indexOf('Exit: ') !== -1) {
                map.topKiller = me.getTopPlayer('kills', map);
                map.topVictim = me.getTopPlayer('deaths', map);
            }
        }
        me.stats.topOverallKiller = me.getOverallTopPlayer('kills', me.stats.maps);
        me.stats.topOverallVictim = me.getOverallTopPlayer('deaths', me.stats.maps);
        console.log(me.stats)
		return me.stats;
	};
}]);