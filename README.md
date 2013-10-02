quake-stats
===========

Quake III Arena statistics which include flag!

Getting Started
---------------
1. First of all - clone the repo.
2. If you don't have node installed on your machine, please install it from [here](http://nodejs.org/). 
3. After node has been install, open CMD, go to the root directory of the project and run `npm install`.
4. If you need to just update the components, run `bower install`.
5. Drop your Quake III Arena games.log file in the root directory of the project.
6. Run `grunt server` from the root directory of the project.

Enabling Flags Statistics
-------------------------
Flags statistics don't come that easy ;)
The games.log file does give some indication of Flags cpatures etc. but it can be inaccurate.
For accuracy you need the qconsole.log, which is a dump of the game console messags.
In order to obtain this file, you need to add the following command to you server configuration:

	logfile 1

Either you do that, or add to the Quake shortcut path the following parameter:

	+set logfile 1

This will dump a qconsole.log file to the baseq3 directory.
When you have this file, simply drop it into this projects root directory as you did for the games.log file.

Your browser shoud open with the application launched.