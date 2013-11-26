'use strict';

var Navigation = function() {
  this.dashboardLink = element(by.repeater('item in menu.items').row(0).column('label'));
};