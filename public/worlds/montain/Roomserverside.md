* room.js, script node in the world directory
* ctor, .destroy(),.update()
* .update(delta, now) to update bots
* for network hooks use the socket
  * server side physics
  * anti cheat

### creation
* room name on joinRoom
* check if room already exists, if not create it
* store it in roomHandlers[]
* on disconnection, remove it if empty

### first test
* a minecraft char running in circle
