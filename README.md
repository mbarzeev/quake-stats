quake-stats
===========

Quake III Arena statistics which include flag!

prerequisites
-------------
1. NodeJS installed on your machine ([here](http://nodejs.org/))
2. Grunt installed on your machine ([here](http://gruntjs.com/getting-started))

Installing
----------
1. First of all - clone the repo.
2. open CMD, go to the root directory of the project and run `npm install` 
3. open CMD, go to the root directory of the project and run `bower install`.
3. Drop your Quake III Arena games.log file in the root directory of the project.
4. If you want to have Flags statistics as well, you need to drop your Quake III arena qconsole.log file in the rot directory of the project. If you don't know how to get it, please read the QConsole Log section below.
5. Run `grunt server` from the root directory of the project.

Your browser shoud open with the application launched.

QConsole Log
------------
Flags statistics don't come that easy ;)
The games.log file does give some indication of Flags cpatures etc. but it can be inaccurate.
For accuracy you need the qconsole.log, which is a dump of the game console messages.
In order to obtain this file, you need to add the following command to you server configuration:

	logfile 1

Either you do that, or add to the Quake shortcut path the following parameter:

	+set logfile 1

This will dump a qconsole.log file to the baseq3 directory.
When you have this file, simply drop it into this projects root directory as you did for the games.log file.

Running Protractor Automation Tests
-----------------------------------
This project support Protractor Automation tests. 
Currently there aren't a lot of them, but the infrastructure is laid down for them to come.
In order to launch the tests first make sure that you're localhost server is up and running and then open CMD on the project’s root directory and run this command:

	node node_modules\protractor\bin\protractor test\automation\conf.js