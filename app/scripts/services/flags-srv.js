'use strict';

angular.module('quakeStatsApp').service('FlagsService', ['Constants', function(Constants) {
    this.stats = null;
    var me = this;

    this.initMap = function(record, startIndex) {
        var map = {};
            
        map.name = me.getMapKey(record);
        map.timeline = [];
        map.startIndex = startIndex;
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
        map.topScorer = null;
        map.topReturner = null;
        map.topCarrierFragger = null;
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
        }
    };

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

    this.getTopPlayer = function(prop, map) {
        var topPlayer = null,
            player = null;
        for (var playerName in map.players) {
            player = map.players[playerName];
            if (topPlayer) {
                if (player[prop] > topPlayer[prop]) {
                    topPlayer = player;
                }
            } else {
                topPlayer = player;
            }
        }
        return topPlayer;
    };

    this.getWins = function(maps) {
        var map,
            wins = {
                '1':0,
                '2':0
            };
        for (var i = 0; i < maps.length; i++) {
            map = maps[i];
            if (map.score[Constants.RED] > map.score[Constants.BLUE]) {
                wins[Constants.RED] += 1;
            } else if (map.score[Constants.RED] < map.score[Constants.BLUE]) {
                wins[Constants.BLUE] += 1;
            }
        }
        return wins;
    };

    this.getFlagsStats = function(log) {
        if (me.stats) {
            return me.stats;
        }
        var i,
            record,
            map,
            playerName;
        me.stats = {};
        me.stats.capturedFlags = {
            '1':0,
            '2':0
        };
        me.stats.maps = [];

        for (i = 0; i < log.length; i++) {
            record = log[i];
            if (record.indexOf('InitGame:') !== -1) {
                map = me.initMap(record, i);
                me.stats.maps.push(map);
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

            // Map end
            if (map && record.indexOf('Exit:') !== -1) {
                map.topScorer = me.getTopPlayer('scores', map);
                map.topReturner = me.getTopPlayer('returns', map);
                map.topCarrierFragger = me.getTopPlayer('carrierFrags', map);
                map.topFetcher = me.getTopPlayer('fetches', map);
                map.endReason = record;
            }
        }

        me.stats.wins = me.getWins(me.stats.maps);
        return me.stats;
    };
}]);