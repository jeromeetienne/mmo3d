chat and fight
==============

Chat and fight is a multiplayer game in webgl.
it is very hackable. other people can easily do their own world.

see [homepage](http://mmo3d.jit.su/) for more details.


# how to make your own world

### Step 1: clone the code

```
git clone git@github.com:jeromeetienne/mmo3d.git
```

### Step 2: run the server

```
cd mmo3d
make server
```

### Step 3: copy an existing world

```
cp -a public/montain public/foobar
```

### Step 4: modify code of foobar world to fit your need

use your text editor in public/foobar :)

### Step 5: check your result

point your browser [here](http://127.0.0.1:8000/foobar)

### Step 6: publish it

you do that whereever you want. Personnaly i go for nodejitsu, they got 
[free hosting for opensource](http://opensource.nodejitsu.com/).

```
make deploy
```