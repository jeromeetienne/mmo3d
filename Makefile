server:
	node src/server.js 8000
	
serverDev:
	forever -w --watchDirectory . src/server.js 8000

deploy:
	jitsu -c deploy
