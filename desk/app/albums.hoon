/-  *albums
/+  default-agent, dbug, agentio
|%
+$  versioned-state
    $%  state-0
    ==
+$  state-0  [%0 =albums]
+$  card  card:agent:gall
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
    =/  =album  [name owner *shared *images]
    :-  ~
    this(albums (~(put by albums) [owner name] album))
    ::
      %nuke
    =/  album-id  +.act
    :-  ~
    this(albums (~(del by albums) album-id))
    ::
      %add
    =/  album-id  +6.act
    =/  image  +7.act
    =/  album  (~(get by albums.this) album-id)
    ?~  album
      ~&  >  ["Album not found" album-id]
      `this
    =/  new-album  %=  u.album
    images  (snoc images.u.album image)
    ==
    :-  ~
    this(albums (~(put by albums) album-id new-album))
      %del
    =/  album-id  +6.act
    =/  image  +7.act
    =/  album  (~(get by albums.this) album-id)
    ?~  album
      ~&  >  ["Album not found" album-id]
      `this
    =/  idx  (find [image]~ images.u.album)
    ?~  idx
      ~&  >  ["Image not found" idx]
      `this
    =/  new-album  %=  u.album
    images  (oust [u.idx 1] images.u.album)
    ==
    :-  ~
    this(albums (~(put by albums) album-id new-album))
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
  ~
  ::?>  (team:title our.bowl src.bowl)
  ::=/  now=@  (unm:chrono:userlib now.bowl)
  ::?+    path  (on-peek:def path)
      ::[%x %entries *]
    ::?+    t.t.path  (on-peek:def path)
        ::[%all ~]
      :::^  ~  ~  %journal-update
      ::!>  ^-  update
      ::[now %jrnl (tap:j-orm journal)]
    ::
        ::[%before @ @ ~]
      ::=/  before=@  (rash i.t.t.t.path dem)
      ::=/  max=@  (rash i.t.t.t.t.path dem)
      :::^  ~  ~  %journal-update
      ::!>  ^-  update
      ::[now %jrnl (tab:j-orm journal `before max)]
    ::::
        ::[%between @ @ ~]
      ::=/  start=@
        ::=+  (rash i.t.t.t.path dem)
        ::?:(=(0 -) - (sub - 1))
      ::=/  end=@  (add 1 (rash i.t.t.t.t.path dem))
      :::^  ~  ~  %journal-update
      ::!>  ^-  update
      ::[now %jrnl (tap:j-orm (lot:j-orm journal `end `start))]
    ::==
  ::::
      ::[%x %updates *]
    ::?+    t.t.path  (on-peek:def path)
        ::[%all ~]
      :::^  ~  ~  %journal-update
      ::!>  ^-  update
      ::[now %logs (tap:log-orm log)]
    ::::
        ::[%since @ ~]
      ::=/  since=@  (rash i.t.t.t.path dem)
      :::^  ~  ~  %journal-update
      ::!>  ^-  update
      ::[now %logs (tap:log-orm (lot:log-orm log `since ~))]
    ::==
  ::==
::
++  on-leave  on-leave:def
++  on-agent  on-agent:def
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
