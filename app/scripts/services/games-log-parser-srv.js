'use strict';

angular.module('quakeStatsApp').service('GamesLogParserService', ['Constants', function(Constants) {
	function isValidRecord(record) {
		return (record && typeof record === 'string');
	}

	this.isMapStart = function(record) {
		if (isValidRecord(record)) {
			return record.indexOf('InitGame:') !== -1;
		}
		throw {
			name: 'Error',
			message: 'Record is not valid',
			record: record
		};
	};

	this.isClientUserinfoChanged = function(record) {
		if (isValidRecord(record)) {
			return record.indexOf(Constants.PLAYER_INFO_KEY) !== -1;
		}
		throw {
			name: 'Error',
			message: 'Record is not valid',
			record: record
		};
	};

	this.getPlayerTeam = function(record) {
		if (isValidRecord(record)) {
			var teamStr = record.substr(record.indexOf(Constants.TEAM_NUM_KEY) + Constants.TEAM_NUM_KEY.length, 1);
			return parseInt(teamStr, 10);
		}
		throw {
			name: 'Error',
			message: 'Record is not valid',
			record: record
		};
	};

	this.getPlayerName = function(record) {
		if (isValidRecord(record)) {
			return record.slice(record.indexOf(Constants.PLAYER_NAME_KEY) + Constants.PLAYER_NAME_KEY.length, record.indexOf(Constants.BACKSLASH_KEY, record.indexOf(Constants.PLAYER_NAME_KEY) + Constants.PLAYER_NAME_KEY.length));
		}
		throw {
			name: 'Error',
			message: 'Record is not valid',
			record: record
		};
	};
}]);