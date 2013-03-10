chat and fight
==============

Chat and fight is a multiplayer game in webgl.
it is very hackable. other people can easily do their own world.

see [homepage](http://jetienne.chatandfight.jit.su/) for more details.


# how to make your own world

### Step 1: clone the code

```
git clone git@github.com:jeromeetienne/chatandfight.git
```

### Step 2: run the server

```
cd chatandfight
make server
```

### Step 3: copy an existing world

```
cp -a public/worlds/montain public/worlds/foobar
```

### Step 4: modify code of foobar world to fit your need

use your text editor :)

### Step 5: check your result

point your browser [here](http://127.0.0.1:8000/public/worlds/foobar)

### Step 6: publish it

you do that whereever you want. Personnaly i love nodejitsu, they got 
[free hosting for opensource](http://opensource.nodejitsu.com/)

```
make deploy
```