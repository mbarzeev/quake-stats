'use strict';

angular.module('quakeStatsApp').service('KillsService', function() {
	this.stats = null;
	var me = this;

	this.getKillsStats = function(log) {
		if (me.stats) {
            return me.stats;
        }
        var i,
            record;
        for (i = 0; i < log.length; i++) {
            record = log[i];
        }
		return log;
	};
});