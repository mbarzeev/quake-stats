'use strict';

angular.module('quakeStatsApp').service('GamesLogParserService', ['Constants', function(Constants) {
	this.isMapStart = function(record) {
		if (record && typeof record == 'string') {
			return record.indexOf('InitGame:') !== -1;
		}
		return false;
	};
}]);