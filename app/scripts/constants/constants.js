'use strict';

angular.module('quakeStatsApp')
    .constant('Constants', {
        'RED': 1,
        'BLUE': 2,
        'TIE': 0,
        'MAP_NAME_KEY': 'mapname\\',
        'PLAYER_NAME_KEY': 'n\\',
        'TEAM_NUM_KEY': 't\\',
        'BACKSLASH_KEY': '\\',
        'PLAYER_INFO_KEY': 'ClientUserinfoChanged:',
        'FLAG_STATUS_IN_BASE': 'inBase',
        'FLAG_STATUS_FETCHED': 'fetched',
        'RED_SCORE_KEY': 'red:',
        'BLUE_SCORE_KEY': 'blue:',
        'FLAG_ABONDON_TIME_LIMIT': 30
    });