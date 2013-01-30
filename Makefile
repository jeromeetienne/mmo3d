server:
	node server.js 8000
	
serverDev:
	forever -w --watchDirectory . server.js 8000

deploy:
	yes | jitsu deploy
