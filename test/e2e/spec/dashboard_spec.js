'use strict';

describe('Quake Stats Navigation', function() {
    it('should have 4 navigation links', function() {
        browser.get('/');

        var dashboardLink = element(by.repeater('item in menu.items').row(0).column('label'));
        expect(dashboardLink.getText()).toEqual('Dashboard');

        var flagsLink = element(by.repeater('item in menu.items').row(1).column('label'));
        expect(flagsLink.getText()).toEqual('Flags');

        var killsLink = element(by.repeater('item in menu.items').row(2).column('label'));
        expect(killsLink.getText()).toEqual('Kills');

        var playersLink = element(by.className('dropdown-toggle'));
        expect(playersLink.getText()).toEqual('PLAYERS');
    });
});
