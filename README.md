quake-stats
===========

Quake III Arena statistics which include flag!

prerequisites
-------------
1. NodeJS installed on your machine ([here](http://nodejs.org/))
2. Grunt installed on your machine ([here](http://gruntjs.com/getting-started))
3. MongoDB installed on your machine and running ([here](http://www.mongodb.org/))

Installing
----------
1. First of all - clone the repo.
2. Under the root directory of the project create a /data/db directory for mongo to use
3. open CMD and launch MongoDB with a dbpath directing to the directory you've just created in the previous step
4. open CMD, go to the root directory of the project and run `npm install`.
5. Run `grunt server` from the root directory of the project.
6. Your browser should open with the application launched.
7. Navigate to localhost:8000/admin.
8. Upload games.log and qconsole.log in the appropriate file inputs, give your game a name. If you can't find qconsole.log, see the QConsole section below.

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
When you have this file, see the install section above about how to use it.

Running Unit Testing
--------------------

#### Single run tests
	grunt test:unit 

Running Protractor Automation Tests
-----------------------------------
This project support Protractor Automation tests. 
Currently there aren't a lot of them, but the infrastructure is laid down for them to come.
In order to launch the tests first make sure that you're localhost server is up and running and then open CMD on the project’s root directory and run this command:

	node node_modules\protractor\bin\protractor test\automation\conf.js
	
Contribution
------------
Please see more details on contribution process on the [Contribution Wiki page](https://github.com/mbarzeev/quake-stats/wiki/Contribution).
