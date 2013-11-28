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
  });

  function isMethodExist(methodName) {
    var func = gamesLogParserService[methodName];
    expect(func).toBeDefined();
    expect(typeof func).toEqual('function');
  }

  function checkFailOnInvalidRecord(methodName) {
    expect (function () {
      gamesLogParserService[methodName]()
    }).toThrow ("Record is not valid");
    expect (function () {
      gamesLogParserService[methodName]({})
    }).toThrow ("Record is not valid");
  } 

  it('Should exist', function () {
    expect(gamesLogParserService).toBeDefined();
  });

  describe('Map Parsing > ', function () {
      it('"isMapStart()" should return a boolean if map started or not', function () {
        isMethodExist('isMapStart');
        checkFailOnInvalidRecord('isMapStart');
        expect(gamesLogParserService.isMapStart(gamesLogMock[3])).toBeFalsy();
        expect(gamesLogParserService.isMapStart(gamesLogMock[342])).toBeFalsy();
        expect(gamesLogParserService.isMapStart(gamesLogMock[465])).toBeFalsy();
        expect(gamesLogParserService.isMapStart(gamesLogMock[2])).toBeFalsy();
        expect(gamesLogParserService.isMapStart(gamesLogMock[1])).toBeTruthy();
      });

      it('"getMapId()" should return the map Quake key', function () {
        isMethodExist('getMapId');
        checkFailOnInvalidRecord('getMapId');
        expect(gamesLogParserService.getMapId(gamesLogMock[1])).toEqual('ump3ctf5')
        expect(gamesLogParserService.getMapId(gamesLogMock[3312])).toEqual('q3ctf4')
      });
  });

  describe('Player Parsing > ', function () {
      it('"isClientUserinfoChanged()" should return a boolean if the a player has changed info or not', function () {
        isMethodExist('isClientUserinfoChanged');
        checkFailOnInvalidRecord('isClientUserinfoChanged');
        expect(gamesLogParserService.isClientUserinfoChanged(gamesLogMock[3])).toBeTruthy();
        expect(gamesLogParserService.isClientUserinfoChanged(gamesLogMock[654])).toBeFalsy();
        expect(gamesLogParserService.isClientUserinfoChanged(gamesLogMock[256])).toBeFalsy();
      });

      it('"getPlayerTeam()" should return a team number', function () {
        isMethodExist('getPlayerTeam');
        checkFailOnInvalidRecord('getPlayerTeam');
        expect(gamesLogParserService.getPlayerTeam(gamesLogMock[3])).toEqual(3);
        expect(gamesLogParserService.getPlayerTeam(gamesLogMock[6])).toEqual(2);
        expect(gamesLogParserService.getPlayerTeam(gamesLogMock[1228])).toEqual(1);
        expect(gamesLogParserService.getPlayerTeam(gamesLogMock[1242])).toEqual(2);
      });

      it('"getPlayerName()" should return a player name', function () {
        isMethodExist('getPlayerName');
        checkFailOnInvalidRecord('getPlayerName');
        expect(gamesLogParserService.getPlayerName(gamesLogMock[1228])).toEqual('Chuck');
        expect(gamesLogParserService.getPlayerName(gamesLogMock[2466])).toEqual('Ninja');
        var mockRecord = '2:21 ClientUserinfoChanged: 4 n\\...\\t\\3\\model\\major/blue\\hmodel\\major/blue\\g_redteam\\\\g_blueteam\\\\c1\\2\\c2\\5\\hc\\100\\w\\0\\l\\0\\tt\\0\\tl\\0'
        expect(gamesLogParserService.getPlayerName(mockRecord)).toEqual('...');
      });

      it('"getPlayerId()" should return a player ID', function () {
        isMethodExist('getPlayerId');
        checkFailOnInvalidRecord('getPlayerId');
        expect(gamesLogParserService.getPlayerId(gamesLogMock[1228])).toEqual(0);
        expect(gamesLogParserService.getPlayerId(gamesLogMock[2466])).toEqual(5);
      });
  })
});