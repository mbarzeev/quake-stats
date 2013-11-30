'use strict';

angular.module('quakeStatsApp').service('FlagsService', ['Constants', function(Constants) {
    this.stats = null;
    var me = this;

    this.initMap = function(record, startIndex, index) {
        var map = {};
            
        map.name = me.getMapKey(record);
        map.timeline = [];
        map.logStartIndex = startIndex;
        map.index = index;
        map.fetches = {
            '1':0,
            '2':0
        };
        map.score = {
            '1':0,
            '2':0
        };
        map.returns = {
            '1':0,
            '2':0
        };
        map.carrierFrags = {
            '1':0,
            '2':0
        };
        map.players = {};
        map.topScorers = null;
        map.topReturners = null;
        map.topCarrierFraggers = null;
        map.endReason = null;
        return map;
    };

    this.getMapKey = function(record) {
        var startIndex = record.indexOf(Constants.MAP_NAME_KEY) + Constants.MAP_NAME_KEY.length,
            endIndex = record.indexOf(Constants.BACKSLASH_KEY, startIndex);
        return record.slice(startIndex, endIndex);
    };

    this.setGotFlag = function(record, map) {
        var playerName = me.getPlayerName(record);
        if (playerName) {
            if (record.indexOf('RED') !== -1) {
                map.fetches[Constants.BLUE] += 1;
            } else if (record.indexOf('BLUE') !== -1) {
                map.fetches[Constants.RED] += 1;
            }
            map.players[playerName].fetches += 1;
            map.players[playerName].fetchToScoreRatio = getFetchToCaptureRatio(map.players[playerName]);
        }
    };

    this.setCapturedFlag = function(record, map) {
        var playerName = me.getPlayerName(record);
        if (playerName) {
            if (record.indexOf('RED') !== -1) {
                map.score[Constants.BLUE] += 1;
                me.stats.capturedFlags[Constants.BLUE] += 1;
            } else if (record.indexOf('BLUE') !== -1) {
                map.score[Constants.RED] += 1;
                me.stats.capturedFlags[Constants.RED] += 1;
            }
            map.players[playerName].scores += 1;
            map.players[playerName].fetchToScoreRatio = getFetchToCaptureRatio(map.players[playerName]);
        }
    };

    function getFetchToCaptureRatio(player) {
        var result = 0;
        if (player.scores !== 0) {
            result = player.scores / player.fetches ;
        }
        return result;
    }

    this.setReturnedFlag = function(record, map) {
        var playerName = me.getPlayerName(record);
        if (playerName) {
            if (record.indexOf('BLUE') !== -1) {
                map.returns[Constants.BLUE] += 1;
            } else if (record.indexOf('RED') !== -1) {
                map.returns[Constants.RED] += 1;
            }
            map.players[playerName].returns += 1;
        }
    };

    this.setFraggedFlagCarrier = function(record, map) {
        var playerName = me.getPlayerName(record);
        if (playerName) {
            if (record.indexOf('BLUE') !== -1) {
                map.carrierFrags[Constants.BLUE] += 1;
            } else if (record.indexOf('RED') !== -1) {
                map.carrierFrags[Constants.RED] += 1;
            }
            map.players[playerName].carrierFrags += 1;
        }
    };

    this.getPlayerName = function(record) {
        if (record.indexOf('^7') !== -1) {
            return record.slice(0, record.indexOf('^7'));
        }
        return null;
    };

    this.getTopPlayers = function(prop, map) {
        var topPlayers = [],
            player = null;
        for (var playerName in map.players) {
            player = map.players[playerName];
            if (topPlayers.length > 0) {
                if (player[prop] > topPlayers[0][prop]) {
                    topPlayers = [player];
                } else if (player[prop] === topPlayers[0][prop]) {
                    topPlayers.push(player);
                }
            } else {
                topPlayers = [player];
            }
        }
        return topPlayers;
    };

    this.getWins = function(maps) {
        var map,
            wins = {
                '1':0,
                '2':0
            };
        for (var mapIndex in maps) {
            map = maps[mapIndex];
            if (map.score[Constants.RED] > map.score[Constants.BLUE]) {
                wins[Constants.RED] += 1;
            } else if (map.score[Constants.RED] < map.score[Constants.BLUE]) {
                wins[Constants.BLUE] += 1;
            }
        }
        return wins;
    };

    this.getOverallTopPlayers = function(prop, maps) {
        var map,
            players = {},
            topPlayers = [],
            playerName;
        for (var mapIndex in maps) {
            map = maps[mapIndex];
            for (playerName in map.players) {
                if (players[playerName] === undefined) {
                    players[playerName] = 0;
                }
                players[playerName] += map.players[playerName][prop];
            }
        }

        for (playerName in players) {
            if (topPlayers.length > 0) {
                if (players[playerName] > topPlayers[0].value) {
                    topPlayers = [{name:playerName, value:players[playerName]}];
                } else if (players[playerName] === topPlayers[0].value) {
                    topPlayers.push({name:playerName, value:players[playerName]});
                }
            } else {
                topPlayers = [{name:playerName, value:players[playerName]}];
            }
        }
        return topPlayers;
    };

    this.getPlayerCaptureRatio = function(player) {
        var map,
            participatingmMapCount = 0,
            mapPlayer,
            totalRatio = 0,
            result = 0;
        for (var mapIndex in me.stats.maps) {
            map = me.stats.maps[mapIndex];
            mapPlayer = map.players[player.name];
            if (mapPlayer) {
                participatingmMapCount++;
                if (mapPlayer.fetches !== 0 && mapPlayer.fetches !== 0) {
                    totalRatio += mapPlayer.scores / mapPlayer.fetches;
                }
                
            }
        }
        if (totalRatio !== 0) {
            result = totalRatio / participatingmMapCount;
        }
        return result;
    };

    this.getFlagsStats = function(log) {
        if (me.stats) {
            return me.stats;
        }
        var i,
            record,
            map,
            playerName,
            mapCount = 0;
        me.stats = {};
        me.stats.capturedFlags = {
            '1':0,
            '2':0
        };
        me.stats.maps = {};

        for (i = 0; i < log.length; i++) {
            record = log[i];
            if (record.indexOf('InitGame:') !== -1) {
                map = me.initMap(record, i, mapCount++);
                me.stats.maps[i] = map;
            }

            // Flag Records
            if (map && record.indexOf('broadcast: print "') !== -1) {
                record = record.slice('broadcast: print "'.length, -3);
                if (record.indexOf('RED') !== -1 || record.indexOf('BLUE') !== -1) {

                    // Register the player to the map
                    playerName = me.getPlayerName(record);
                    if (playerName && map.players[playerName] === undefined) {
                        map.players[playerName] = {
                            name:playerName,
                            scores:0,
                            fetches:0,
                            carrierFrags:0,
                            returns:0,
                            rebounds:0
                        };
                    }
                    //
                    if (record.indexOf('got') !== -1) {
                        me.setGotFlag(record, map);
                    }

                    if (record.indexOf('captured') !== -1) {
                        me.setCapturedFlag(record, map);
                    }

                    if (record.indexOf('returned') !== -1) {
                        me.setReturnedFlag(record, map);
                    }

                    if (record.indexOf('fragged') !== -1) {
                        me.setFraggedFlagCarrier(record, map);
                    }
                    //
                    map.timeline.push(record);
                }
            }

            if (map && record.indexOf('Exit:') !== -1) {
                map.endReason = record;
            }

            // Map end
            if (map && record.indexOf('ShutdownGame:') !== -1) {
                map.topScorers = me.getTopPlayers('scores', map);
                map.topReturners = me.getTopPlayers('returns', map);
                map.topCarrierFraggers = me.getTopPlayers('carrierFrags', map);
                map.topFetchers = me.getTopPlayers('fetches', map);
            }
        }

        me.stats.wins = me.getWins(me.stats.maps);
        me.stats.topOverallScorers = me.getOverallTopPlayers('scores', me.stats.maps);
        me.stats.topOverallFetchers = me.getOverallTopPlayers('fetches', me.stats.maps);
        me.stats.topOverallRetuners = me.getOverallTopPlayers('returns', me.stats.maps);
        me.stats.topOverallCarrierFraggers = me.getOverallTopPlayers('carrierFrags', me.stats.maps);
        var topOverallFetchToCaptureRatioPlayer = me.getOverallTopPlayers('fetchToScoreRatio', me.stats.maps);
        topOverallFetchToCaptureRatioPlayer.value = topOverallFetchToCaptureRatioPlayer.value / mapCount;
        me.stats.topOverallFetchToCaptureRatioPlayer = topOverallFetchToCaptureRatioPlayer;
        return me.stats;
    };
}]);