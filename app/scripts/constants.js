'use strict';

angular.module('quakeStatsApp')
  .constant('Constants',  {
  	'RED' : 1,
  	'BLUE' : 2,
  	'MAP_NAME_KEY' : 'mapname\\',
  	'PLAYER_NAME_KEY' : 'n\\',
  	'TEAM_NUM_KEY' : 't\\',
  	'BACKSLASH_KEY' : '\\',
  	'PLAYER_INFO_KEY' : 'ClientUserinfoChanged:',
  	'FLAG_STATUS_IN_BASE' : 'inBase',
  	'FLAG_STATUS_FETCHED' : 'fetched',
  	'FLAG_STATUS_REBOUNDED' : 'rebounded'
  });