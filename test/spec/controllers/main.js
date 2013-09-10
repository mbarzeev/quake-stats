'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('quakeStatsApp'));

  var MainCtrl,
    scope,
    mockStats = {
      gamesStats: []
    };

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      Constants: {},
      stats: mockStats
    });
  }));

  it('should attach a list of games to the scope', function () {
    expect(scope.games).toBeDefined();
  });
});
