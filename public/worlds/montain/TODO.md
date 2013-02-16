### schedule
* start another world

### code
* do character.js
  * all the createPlayer/destroyPlayer
  * .nickname('john')
  * player animation go there
  * .say('hello world.')
* do player.js
  * inherit from character.js
* DONE sceneLights.js
* DONE sceneGround.js

### how to link the network ?

* put as much as possible in the objects
* ```gameServer``` is a global
* send to yeller with sourceId

#### what about a microevent.js

DONE 

```
var yeller	= {};
tQuery.MicroeventMixin(yeller);
yeller.addEventListener('hello', function(){ console.log('received hello')});
yeller.dispatchEvent('hello')
```



