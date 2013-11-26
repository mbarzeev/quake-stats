'use strict';

describe('Service: GameStatsService', function () {
  var gameStatsService = null,
      Constants = null;

  // load the service's module
  beforeEach(module('quakeStatsApp'));

  beforeEach(function() {
    inject(function($injector, $http) {
      gameStatsService = $injector.get('GameStatsService');
      Constants = $injector.get('Constants');
    });
  })

  it('should exist', function () {
    expect(gameStatsService).toBeDefined();
  });

  it('should have getAllGames method', function () {
    expect(gameStatsService.getAllGames).toBeDefined();
  });

  it('should return Array when invoking the getAllGames method', function () {
    expect(angular.isArray(gameStatsService.getAllGames(null))).toEqual(true);
    expect(gameStatsService.getAllGames(null).length).toEqual(0);
  });

  
});