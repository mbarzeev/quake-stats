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
        var mockRecord
        isMethodExist('getPlayerName');
        checkFailOnInvalidRecord('getPlayerName');
        expect(gamesLogParserService.getPlayerName(gamesLogMock[1228])).toEqual('Chuck');
        expect(gamesLogParserService.getPlayerName(gamesLogMock[2466])).toEqual('Ninja');
        mockRecord = '2:21 ClientUserinfoChanged: 4 n\\...\\t\\3\\model\\major/blue\\hmodel\\major/blue\\g_redteam\\\\g_blueteam\\\\c1\\2\\c2\\5\\hc\\100\\w\\0\\l\\0\\tt\\0\\tl\\0'
        expect(gamesLogParserService.getPlayerName(mockRecord)).toEqual('...');
        mockRecord = '54:27 score: 46  ping: 0  client: 2 Alain Delon'
        expect(gamesLogParserService.getPlayerName(mockRecord)).toEqual('Alain Delon');
        mockRecord = '8:00 score: 0  ping: 5  client: 4 Neo'
        expect(gamesLogParserService.getPlayerName(mockRecord)).toEqual('Neo');
      });

      it('"getPlayerId()" should return a player ID', function () {
        isMethodExist('getPlayerId');
        checkFailOnInvalidRecord('getPlayerId');
        expect(gamesLogParserService.getPlayerId(gamesLogMock[1228])).toEqual(0);
        expect(gamesLogParserService.getPlayerId(gamesLogMock[2466])).toEqual(5);
      });
  })

  describe('Kill Parsing > ', function () {
      it('"isKill()" should return a boolean if the record is a kill record or not', function () {
        isMethodExist('isKill');
        checkFailOnInvalidRecord('isKill');
        expect(gamesLogParserService.isKill(gamesLogMock[16])).toBeTruthy();
        expect(gamesLogParserService.isKill(gamesLogMock[654])).toBeTruthy();
        expect(gamesLogParserService.isKill(gamesLogMock[256])).toBeFalsy();
      });

      it('"getKillObj()" should return a Kill Object', function () {
        isMethodExist('getKillObj');
        checkFailOnInvalidRecord('getKillObj');
        var killObj = gamesLogParserService.getKillObj(gamesLogMock[16]);
        expect(killObj).toBeDefined();
        expect(killObj.killer).toBeDefined();
        expect(killObj.killer).toEqual(0);
        expect(killObj.victim).toBeDefined();
        expect(killObj.victim).toEqual(0);
        expect(killObj.mode).toBeDefined();
        expect(killObj.mode).toEqual(20);
        expect(killObj.killerName).toBeDefined();
        expect(killObj.killerName).toEqual('Chuck');
        expect(killObj.victimName).toBeDefined();
        expect(killObj.victimName).toEqual('Chuck');
        var killObj = gamesLogParserService.getKillObj(gamesLogMock[103]);
        expect(killObj).toBeDefined();
        expect(killObj.killer).toBeDefined();
        expect(killObj.killer).toEqual(2);
        expect(killObj.victim).toBeDefined();
        expect(killObj.victim).toEqual(0);
        expect(killObj.mode).toBeDefined();
        expect(killObj.mode).toEqual(6);
        expect(killObj.killerName).toBeDefined();
        expect(killObj.killerName).toEqual('Pat');
        expect(killObj.victimName).toBeDefined();
        expect(killObj.victimName).toEqual('Chuck');
      });
  });

  describe('Shutdown Parsing > ', function () {
      it('"isShutdown()" should return a boolean if the map is over record or not', function () {
        isMethodExist('isShutdown');
        checkFailOnInvalidRecord('isShutdown');
        expect(gamesLogParserService.isShutdown(gamesLogMock[16])).toBeFalsy();
        expect(gamesLogParserService.isShutdown(gamesLogMock[654])).toBeFalsy();
        expect(gamesLogParserService.isShutdown(gamesLogMock[256])).toBeFalsy();
        expect(gamesLogParserService.isShutdown(gamesLogMock[1223])).toBeTruthy();
      });
  });
});