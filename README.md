tquery-multiplayerserver
========================

multiplayer server for tquery experiments


## Notes
* keep it simple and minimal
* try to make it generic
  * aka it isnt specific to a given experiment/game

* so no security on server ?
  * nevertheless client can implement security on the client side 

### About API
* easy to include in a game

### About proto



### User
* each connection got a user
* a user got a humanName (given by client)
  * unique, server side ?
* a user got a socket.id (given by server)
* a user got a profile opaque blob (given by the client)
* a userlist of those information is maintained by the server

### Feature
* measure latency with ping
* ability for client to broadcast message
* a message rate limiter as anti-DoS measure