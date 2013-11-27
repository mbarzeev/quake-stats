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
    return func && (typeof func === 'function');
  }

  it('Should exist', function () {
    expect(gamesLogParserService).toBeDefined();
  });

  it('"isMapStart()" should return a boolean if map started or not', function () {
    expect(isMethodExist('isMapStart')).toBeTruthy();
    expect (function () {
        gamesLogParserService.isMapStart()
    }).toThrow ("Record is not valid");
    expect (function () {
        gamesLogParserService.isMapStart({})
    }).toThrow ("Record is not valid");
    expect(gamesLogParserService.isMapStart(gamesLogMock[3])).toBeFalsy();
    expect(gamesLogParserService.isMapStart(gamesLogMock[342])).toBeFalsy();
    expect(gamesLogParserService.isMapStart(gamesLogMock[465])).toBeFalsy();
    expect(gamesLogParserService.isMapStart(gamesLogMock[2])).toBeFalsy();
    expect(gamesLogParserService.isMapStart(gamesLogMock[1])).toBeTruthy();
  });

  it('"isClientUserinfoChanged()" should return a boolean if the a player has changed info or not', function () {
    expect(isMethodExist('isClientUserinfoChanged')).toBeTruthy();
    expect (function () {
        gamesLogParserService.isClientUserinfoChanged()
    }).toThrow ("Record is not valid");
    expect (function () {
        gamesLogParserService.isClientUserinfoChanged({})
    }).toThrow ("Record is not valid");
    expect(gamesLogParserService.isClientUserinfoChanged(gamesLogMock[3])).toBeTruthy();
    expect(gamesLogParserService.isClientUserinfoChanged(gamesLogMock[654])).toBeFalsy();
    expect(gamesLogParserService.isClientUserinfoChanged(gamesLogMock[256])).toBeFalsy();
  });

  it('"getPlayerTeam()" should return a team number', function () {
    expect(isMethodExist('getPlayerTeam')).toBeTruthy();
    expect (function () {
        gamesLogParserService.getPlayerTeam()
    }).toThrow ("Record is not valid");
    expect (function () {
        gamesLogParserService.getPlayerTeam({})
    }).toThrow ("Record is not valid");
    expect(gamesLogParserService.getPlayerTeam(gamesLogMock[3])).toEqual(3);
    expect(gamesLogParserService.getPlayerTeam(gamesLogMock[6])).toEqual(2);
    expect(gamesLogParserService.getPlayerTeam(gamesLogMock[1228])).toEqual(1);
    expect(gamesLogParserService.getPlayerTeam(gamesLogMock[1242])).toEqual(2);
  });

  it('"getPlayerName()" should return a player name', function () {
    expect(isMethodExist('getPlayerName')).toBeTruthy();
    expect (function () {
        gamesLogParserService.getPlayerName()
    }).toThrow ("Record is not valid");
    expect (function () {
        gamesLogParserService.getPlayerName({})
    }).toThrow ("Record is not valid");
    expect(gamesLogParserService.getPlayerName(gamesLogMock[1228])).toEqual('Chuck');
    expect(gamesLogParserService.getPlayerName(gamesLogMock[2466])).toEqual('Ninja');
    var mockRecord = '2:21 ClientUserinfoChanged: 4 n\\...\\t\\3\\model\\major/blue\\hmodel\\major/blue\\g_redteam\\\\g_blueteam\\\\c1\\2\\c2\\5\\hc\\100\\w\\0\\l\\0\\tt\\0\\tl\\0'
    expect(gamesLogParserService.getPlayerName(mockRecord)).toEqual('...');
  });
});