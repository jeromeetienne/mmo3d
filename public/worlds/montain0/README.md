### TODO
* isolate the concepts
* makes them plugins or other
* make worlds share concept and code
* what are the big parts
  * a moving character
  * ability to chat
  * multiplayer
* do different worlds to proove the concepts
* on the screen, you got
  * a map (which may be instanced or not)
  * characters
  * chat 
  * internally you got the network too
* how to make them fight ?
  * interaction between player
  * currently only chat
  * able to shoot/kick each other would be cool
  * able to throw things ?
* how to handle the server side ?
  * what if a given room is asked/connected
  * store a server.js or something in the room folder
  * what does it contains ?
  * how to interact with the base server ?
    * events per client ?
    
### rewriting
* i feels like it worth rewriting the client
* current client is nice for a prototype
* need to be rewritten to get clean
* what is the plan to rewrite ?
  * ok so step by steps...
  * forget current code

### characters
* various characters
  * minecraft
  * car
  * md2
  * all got multiple skins

### chat
* can the chat module be plugged on each character
* what is the chat ?
  * 2d ui
  * display in 3d

### ideas
* make a share button
* make a dom boilerplate too
  * page title

### concepts
* what is a room
  * each is a standalone page
* you are a player
* multiplayer games
* ability to chat
* currently you can change skin or display your nick
  * change skin is clearly optional
  * change nick or display nick seems important
* so multiplayer, to play with friends
  * chat to communicate with them
  * nick to identify them

### centralisation
* name stored in browser storage (cookie or other)
* no important for now

### init steps
* display a "loading page"
* connect to the server
  * dont do anything before being 'roomJoined'
* then init 3d world
* then init my player character
* then receive notification from the server and act accordingly




*******************************************
### scenarios
* simple landscape 
  * grass ground + skybox
* simple maze with collision
* enemies ?
* able to fight each other ?
  * good idea
  * how to detect collision
  * what is the concequence of the collision
  * how to hit ? yellingm clicking
* hit with a sword ? throwing a bullet ? (how to handle the bullet)
* a bullet is a object standalone ...
  * where is it run ? on the server ?