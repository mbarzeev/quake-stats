'use strict';

angular.module('quakeStatsApp').service('GamesLogParserService', ['Constants', function(Constants) {
	function isValidRecord(record) {
		if (record && typeof record === 'string') {
			return true;
		}
		throw {
			name: 'Error',
			message: 'Record is not valid',
			record: record
		};
	}

	this.isMapStart = function(record) {
		if (isValidRecord(record)) {
			return record.indexOf('InitGame:') !== -1;
		}
	};

	this.getMapId = function(record) {
		if (isValidRecord(record)) {
			var startIndex = record.indexOf(Constants.MAP_NAME_KEY) + Constants.MAP_NAME_KEY.length,
				endIndex = record.indexOf(Constants.BACKSLASH_KEY, startIndex);
			return record.slice(startIndex, endIndex);
		}
	};

	this.isClientUserinfoChanged = function(record) {
		if (isValidRecord(record)) {
			return record.indexOf(Constants.PLAYER_INFO_KEY) !== -1;
		}
	};

	this.getPlayerTeam = function(record) {
		if (isValidRecord(record)) {
			var teamStr = record.substr(record.indexOf(Constants.TEAM_NUM_KEY) + Constants.TEAM_NUM_KEY.length, 1);
			return parseInt(teamStr, 10);
		}
	};

	this.getPlayerName = function(record) {
		if (isValidRecord(record)) {
			if (record.indexOf(Constants.PLAYER_NAME_KEY) !== -1) {
				return record.slice(record.indexOf(Constants.PLAYER_NAME_KEY) + Constants.PLAYER_NAME_KEY.length, record.indexOf(Constants.BACKSLASH_KEY, record.indexOf(Constants.PLAYER_NAME_KEY) + Constants.PLAYER_NAME_KEY.length));
			}
			if (record.indexOf(Constants.SCORE) !== -1) {
				// Yes, regex is more elegant, I know...
				var start = record.indexOf(' ', record.lastIndexOf(':') + 2) + 1;
				return record.slice(start, record.length);
			}
		}
	};

	this.getPlayerId = function(record) {
		if (isValidRecord(record)) {
			var idStr = record.slice(record.indexOf(Constants.PLAYER_INFO_KEY) + Constants.PLAYER_INFO_KEY.length, record.indexOf(Constants.PLAYER_NAME_KEY));
			return parseInt(idStr, 10);
		}
	};

	this.isKill = function(record) {
		if (isValidRecord(record)) {
			return record.indexOf('Kill: ') !== -1;
		}
	};

	this.getKillObj = function(record) {
		if (isValidRecord(record)) {
			var killStr = record.slice(record.indexOf('Kill: ') + 'Kill: '.length, record.indexOf(':', record.indexOf('Kill: ') + 'Kill: '.length)),
				idsArr = killStr.split(' ');
			var killObj = {
				killer : parseInt(idsArr[0], 10),
				victim : parseInt(idsArr[1], 10),
				mode : parseInt(idsArr[2], 10),
				killerName : record.slice(record.indexOf(killStr + ': ') + (killStr + ': ').length, record.indexOf(' killed')),
				victimName : record.slice(record.indexOf('killed ') + 'killed '.length, record.indexOf(' by'))
			};
			return killObj;
		}
	};

	this.isShutdown = function(record) {
		if (isValidRecord(record)) {
			return record.indexOf('ShutdownGame:') !== -1;
		}
	};

	this.isScore = function(record) {
		if (isValidRecord(record)) {
			return record.indexOf(Constants.SCORE) !== -1;
		}
	};

	this.getScore = function(record) {
		if (isValidRecord(record)) {
			var start = record.indexOf(' ', record.lastIndexOf(Constants.SCORE) + 2) + 1;
			var end = record.indexOf('ping:');
			return parseInt(record.slice(start, end), 10);
		}
	};
}]);