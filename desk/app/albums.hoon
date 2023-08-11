/-  *albums
/+  default-agent, dbug, agentio, al=albums 
|%
+$  versioned-state
    $%  state-0
    ==
+$  state-0  [%0 =albums]
+$  card  card:agent:gall
++  comment-on  ((on @da comment) gth)
++  image-on  ((on @da image) gth)
--
%-  agent:dbug
=|  state-0
=*  state  -
^-  agent:gall
|_  =bowl:gall
+*  this  .
    def   ~(. (default-agent this %|) bowl)
    io    ~(. agentio bowl)
++  on-init  on-init:def
++  on-save
  ^-  vase
  !>(state)
::
++  on-load
  |=  old-vase=vase
  ^-  (quip card _this)
  `this(state !<(versioned-state old-vase))
::
++  on-poke
  |=  [=mark =vase]
  ^-  (quip card _this)
  ?.  ?=(%albums-action mark)  (on-poke:def mark vase)
  =/  act  !<(action vase)
  ?-    -.act
      %create
    =/  name  +.act
    =/  owner  our.bowl
    =/  =album  [name owner ~[owner] *images]
    :-  ~
    this(albums (~(put by albums) [name owner] album))
    ::
      %nuke
    =/  album-id  +.act
    ~&  >>  album-id
    :-  ~
    this(albums (~(del by albums) album-id))
    ::
      %add
    =,  act
    ?.  (~(has by albums.this) album-id)
      ~&  >  ["Album not found" album-id]
      `this
    =/  album  (~(got by albums.this) album-id)
    =/  img=image  [src caption *comments]
    =/  new-album  %=  album
    images  (~(put by images.album) img-id img)
    ==
    :-  ~
    this(albums (~(put by albums) album-id new-album))
    ::
      %del
    =,  act
    ?.  (~(has by albums.this) album-id)
      ~&  >  ["Album not found" album-id]
      `this
    =/  album  (~(got by albums) album-id)
    =/  img-list  ~(key by images.album)
    ?.  (~(has in img-list) img-id)
      ~&  >  ["Image not found" img-id]
      `this
    =/  new-album  %=  album
    images  (~(del by images.album) img-id)
    ==
    :-  ~
    this(albums (~(put by albums) album-id new-album))
    ::  
      %comment
    =,  act
    =/  album  (~(get by albums.this) album-id)
    ?~  album
      ~&  >  ["Album not found" album-id]
      `this
    =/  img-list  ~(key by images.u.album)
    ?~  (~(has in img-list) img-id)
      ~&  >  ["Image not found" img-id]
      `this
    :: make sure we own the album if not poke the owner with the comment
    ?.  =(owner.u.album who.comment)
      ~&  >  ["We don't own the album" who.comment owner.u.album]
      =/  cad  [%comment album-id image comment ~] 
      ::`this
      :_  this 
      :~  [%pass /comment %agent [owner.u.album dap.bowl] %poke %albums-action !>(cad)]
      ==
    ?~  (find shared.u.album ~[who.comment])
      ~&  >  ["We havent shared the album with this person" who.comment]
      `this
    =/  old-image  (~(got by images.u.album) img-id)
    =/  comments  comments.old-image
    =/  new-image  old-image(comments (put:comment-on comments when.comment comment))
    =/  new-album  u.album(images (~(put by images.u.album) img-id new-image))
    :-  ~
    this(albums (~(put by albums) album-id new-album))
    ::
      %share
    !!
  ==
::
++  on-watch
  |=  =path
  ^-  (quip card _this)
  ?>  (team:title our.bowl src.bowl)
  ?+  path  (on-watch:def path)
    [%updates ~]  `this
  ==
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?>  (team:title our.bowl src.bowl)
  =/  now  now.bowl
  ?+  path  (on-peek:def path)
      [%x %list ~]
    :^  ~  ~  %albums-update
    !>  ^-  update
    [%album-id ~(tap in ~(key by albums))]
    ::
      [%x %album name owner ~]
    =/  =name   &3.path
    =/  =owner  (slav %p &4.path)
    :^  ~  ~  %albums-update
    !>  ^-  update
    [%album (~(got by albums) [name owner])]
  ==
::
++  on-leave  on-leave:def
++  on-agent  on-agent:def
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
