* room.js, script node in the world directory
* ctor, .destroy(),.update()
* .update(delta, now) to update bots
* for network hooks?
  * use the socket? Use special event notified thru socket?
  * specific event is safer, finer granularity, use eventemitter already in socket
  * Needed for anti cheat

### creation
* room name on joinRoom! Create it doesnt exist
* store it in roomHandlers[]
* on disconnection, remove it if empty

### first test
* a minecraft char running in circle
* user based on twitter
* people as pacman or gost
