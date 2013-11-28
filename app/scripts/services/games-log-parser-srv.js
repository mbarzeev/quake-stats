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
			return record.slice(record.indexOf(Constants.PLAYER_NAME_KEY) + Constants.PLAYER_NAME_KEY.length, record.indexOf(Constants.BACKSLASH_KEY, record.indexOf(Constants.PLAYER_NAME_KEY) + Constants.PLAYER_NAME_KEY.length));
		}
	};

	this.getPlayerId = function(record) {
		if (isValidRecord(record)) {
			var idStr = record.slice(record.indexOf(Constants.PLAYER_INFO_KEY) + Constants.PLAYER_INFO_KEY.length, record.indexOf(Constants.PLAYER_NAME_KEY));
			return parseInt(idStr, 10);
		}
	};
}]);