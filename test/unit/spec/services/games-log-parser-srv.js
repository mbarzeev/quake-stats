'use strict';

describe('GamesLogParserService: ', function () {
  var gamesLogParserService = null,
      Constants = null;

  // load the service's module
  beforeEach(module('quakeStatsApp'));

  beforeEach(function() {
    inject(function($injector, $http) {
      gamesLogParserService = $injector.get('GamesLogParserService');
      Constants = $injector.get('Constants');
    });
  })

  it('Should exist', function () {
    expect(gamesLogParserService).toBeDefined();
  });

  it('should have a "isMapStart()" method', function () {
    expect(gamesLogParserService.isMapStart).toBeDefined();
    expect(typeof gamesLogParserService.isMapStart).toEqual('function');
  });

  it('"isMapStart()" should return a boolean if map started or not', function () {
    expect(gamesLogParserService.isMapStart()).toBeFalsy();
    expect(gamesLogParserService.isMapStart({})).toBeFalsy();
    expect(gamesLogParserService.isMapStart(gamesLogMock[3])).toBeFalsy();
    expect(gamesLogParserService.isMapStart(gamesLogMock[342])).toBeFalsy();
    expect(gamesLogParserService.isMapStart(gamesLogMock[465])).toBeFalsy();
    expect(gamesLogParserService.isMapStart(gamesLogMock[2])).toBeFalsy();
    expect(gamesLogParserService.isMapStart(gamesLogMock[1])).toBeTruthy();
  });
});