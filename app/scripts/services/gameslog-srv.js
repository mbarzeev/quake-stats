// Reading material
// ----------------
// http://www.nanobit.net/doxy/quake3/g__client_8c-source.html
// G_LogPrint is the method name for printing to the log on this file: https://github.com/id-Software/Quake-III-Arena/blob/dbe4ddb10315479fc00086f08e25d968b4b43c49/code/game/g_main.c
// http://planetquake.gamespy.com/View.php?view=Guides.Detail&id=51&game=4

'use strict';

angular.module('quakeStatsApp')
  .service('GameslogService', ['$http', 'Constants', function ($http, Constants) {
 	this.maps = {
 		"q3ctf1" : "Dueling Keeps", 
		"q3ctf3" : "The Stronghold",
 		"q3ctf4" : "Space CTF",
 		"speedyctf" : "Speedy",
 		"q3ctf2": "Troubled Waters",
        "ump3ctf1": "Breakdown",
        "ump3ctf2": "Hydrophobia",
        "ump3ctf3": "Got Wood",
        "ump3ctf4": "Frozen Colors",
        "ump3ctf5": "Railfest 2: 7Zark7 Island",
        "ump3ctf6": "Like spinning plates",
        "ump3ctf7": "The Strong Jaeger"
 	};
 	this.gameslog = null;
 	this.loglines = null;
 	this.blueFlagStatus = Constants.FLAG_STATUS_IN_BASE;
 	this.redFlagStatus = Constants.FLAG_STATUS_IN_BASE;
    this.games = [];
 	var me = this;

 	this.loadLog = function() {
 		return $http.get('/rest/games/log').success(function(data) {  	
	    	me.gameslog = data;
	    	me.loglines = me.gameslog.split("\n");	    
	    });
 	}

 	this.getGameObject = function(line, index) {
    	var startIndex = line.indexOf(Constants.MAP_NAME_KEY) + Constants.MAP_NAME_KEY.length,
    		endIndex =   line.indexOf(Constants.BACKSLASH_KEY, startIndex),
    		key = line.slice(startIndex, endIndex).toLowerCase(),
    		mapname = me.getGameName(key);
    	return {
    		"index" : index,
    		"mapname" : mapname
    	}
    } 

    this.getAllGames = function() {
    	var line;
    	// FIXME: Remove and use Route Resolve instead
    	if (me.loglines ==  null) {
    		this.loadLog().then(function() {
                // FIXME: Remove suplicated loop (below)
    			for (var index in me.loglines) {
					line = me.loglines[index];
					if (line.indexOf('InitGame:') !== -1) {
                        me.games.push(me.getGame(index));
					}			
		    	}
		    	return me.games;
    		})
    	}
    	return me.games;
    }

    this.getGame = function(index) {
    	var game = {},
    		record = null,
    		players = {},
    		flags = [],
    		redTeam = [],
    		blueTeam = [],
            score = {},
            bestScorer = null,
            bestFetcher = null,
            bestRebounder = null,
            bestRestorer = null;
    	
        score[Constants.RED] = 0;
        score[Constants.BLUE] = 0;
    	me.redFlagStatus = Constants.FLAG_STATUS_IN_BASE;
		me.blueFlagStatus = Constants.FLAG_STATUS_IN_BASE;

    	for (var i = index; i < me.loglines.length; i++) {
    		record = me.loglines[i];
    		if (i === index) {
    			game.name = me.getGameObject(record, index).mapname;
                game.recordIndex = me.getGameObject(record, index).index;
    		}

			if (record.indexOf(Constants.PLAYER_INFO_KEY) !== -1) {
				players[me.getPlayerObject(record).id] = me.getPlayerObject(record); 
			}

            // Flags
			if (record.indexOf('team_CTF_') !== -1) {
                var flag = me.getFlagObject(record, players);
                if (flag.action === "scored!") {
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
				return game; 
			}
    	}     		
    }

    this.getBest = function(players, prop) {
        var bestScorer = null,
            player = null;
        for (var item in players) {
            player = players[item];            
            if (bestScorer == null) {
                bestScorer = player;
                continue;
            }
            if (player[prop] > bestScorer[prop]) {
                bestScorer = player
            }
        }
        return bestScorer;
    }

    this.getPlayerObject = function(record) {
    	var player = {},
    	idStr = record.slice(record.indexOf(Constants.PLAYER_INFO_KEY) + Constants.PLAYER_INFO_KEY.length, record.indexOf(Constants.PLAYER_NAME_KEY)),
        nameStr = record.slice(record.indexOf(Constants.PLAYER_NAME_KEY) + Constants.PLAYER_NAME_KEY.length, record.indexOf(Constants.BACKSLASH_KEY, record.indexOf(Constants.PLAYER_NAME_KEY) + Constants.PLAYER_NAME_KEY.length)),
        teamStr = record.substr(record.indexOf(Constants.TEAM_NUM_KEY) + Constants.TEAM_NUM_KEY.length, 1);
    	
        player.id = parseInt(idStr);    	
    	player.name = nameStr;    	
    	player.team = parseInt(teamStr);
        player.fetchedFlags = 0;
        player.restoredFlags = 0;
        player.reboundedFlags = 0;
        player.scoredFlags = 0;
		return player;
    }

    this.getFlagObject = function(record, players) {
    	var flag = {};
    	var idStr = record.slice(record.indexOf('Item: ') + 6, record.indexOf('team_CTF_'));
    	var playerId = parseInt(idStr);
    	var player = players[playerId];

        if (player) {    	
        	flag.record = record;
        	flag.player = player;
        	if (record.indexOf('redflag') !== -1) {
        		flag.color = Constants.RED;
        		flag.action = me.getRedFlagAction(record, player)
        	}
        	if (record.indexOf('blueflag') !== -1) {
        		flag.color = Constants.BLUE;
        		flag.action = me.getBlueFlagAction(record, player)
        	}
        }
    	return flag;
    }

    this.getRedFlagAction = function(record, player) {
    	if (player.team === 2) {
    		if (me.redFlagStatus === Constants.FLAG_STATUS_IN_BASE) {
	    		me.redFlagStatus = Constants.FLAG_STATUS_FETCHED
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
    }

    this.getBlueFlagAction = function(record, player) {
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
    }

    this.getGameName = function(key) {
    	var name = key;
    	if (me.maps.hasOwnProperty(key)) {
			name = me.maps[key]
		} 
		return name;
    }
  }]);