/-  *albums
/+  default-agent, dbug, agentio, al=albums, string, verb
|%
+$  versioned-state
    $%  state-0
    ==
+$  state-0  [%0 =albums]
+$  card  card:agent:gall
++  comment-on  ((on @da comment) gth)
++  image-on  ((on @da image) gth)
--
%+  verb  &
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
    =/  name  (crip (replace:string " " "-" (trip +.act)))
    =/  owner  our.bowl
    =/  =shared  (malt (limo ~[[owner %.y]]))
    =/  =album  [name owner shared *images '']
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
    ?.  (~(has by albums) album-id)
      ~&  >  ["Album not found" album-id]
      `this
    =/  album  (~(got by albums) album-id)
    =/  img=image  [src caption *comments]
    =/  new-album  %=  album
    images  (~(put by images.album) img-id img)
    cover  src
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
    =/  album=(unit album)  (~(get by albums.this) album-id)
    ?~  album
      ~&  >  ["Album not found" album-id]
      `this
    =/  img-list  ~(key by images.u.album)
    ?.  (~(has in img-list) img-id)
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
    =/  shared=(list @p)  ~(tap in ~(key by shared.u.album))
    ?~  (find ~[who.comment] shared)
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
    =,  act
    ?>  =(src.bowl owner.album-id)
    ?:  =(src.bowl our.bowl) :: If we're adding someone to shared list
      =/  new-album  (~(got by albums) album-id)
      =.  shared.new-album  (~(put by shared.new-album) receiver write-perm)
      :_  this(albums (~(put by albums) album-id new-album))
      :~  [%pass /share %agent [receiver dap.bowl] %poke %albums-action !>(act)]
      ==
    =/  =wire  /share/(scot %p owner.album-id)/[name.album-id]
    ~&  >  ['share wire' wire]
    :_  this
    :~  [%pass wire %agent [src.bowl dap.bowl] %watch /(scot %p owner.album-id)/[name.album-id]]
    ==
  ==
::
++  on-agent
  |=  [=(pole knot) =sign:agent:gall]
  ~&  >  ['agent pole' pole]
  ^-  (quip card _this)
  ?.  ?=([%share owner=@ name=@ ~] pole)  `this
    :: switch on the type of event
    ::
    ~&  ['agent -.sign' -.sign]
    ?+    -.sign  (on-agent:def pole sign)
      ::
        %fact
      ?>  ?=(%update p.cage.sign)
      =/  =update  !<(update q.cage.sign)
      ?.  ?=(%album -.update)  `this
      :-  ~
      this(albums (~(put by albums) [name.album.update owner.album.update] album.update))
      :: if we've been kicked from the subscription,
      :: automatically resubscribe
      ::
        %kick
      :_  this
      :~  [%pass pole %agent [src.bowl dap.bowl] %watch /[owner.pole]/[name.pole]]
      ==
        %watch-ack
      ?~  p.sign
        ((slog '%todo-watcher: Subscribe succeeded!' ~) `this)
      ~&  p.sign
      ((slog '%todo-watcher: Subscribe failed!' ~) `this)
    ==
::
++  on-watch
  ::
  |=  =(pole knot)
  ^-  (quip card _this)
  ~&  >  ['watch pole' pole]
  ?>  (team:title our.bowl src.bowl)
  ?+  pole  (on-watch:def pole)
      [%share owner=@ name=@ ~]
    =/  album=(unit album)  (~(get by albums.this) [name.pole owner.pole])
    ?~  album  `this
    =/  shared=(list @p)  ~(tap in ~(key by shared.u.album))
    ?~  (find ~[src.bowl] shared)
      ~&  >  ["We havent shared the album with this person" src.bowl]
      `this
    :_  this
    :~  [%give %fact ~[/'shared'/pole] %update !>(u.album)]
    ==
  ==
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ?>  (team:title our.bowl src.bowl)
  =/  now  now.bowl
  ?+  path  (on-peek:def path)
      [%x %list ~]
    =/  =album-ids  ~(tap in ~(key by albums))
    =/  album-info  %+  turn  album-ids
      |=  =album-id
      =/  =album  (~(got by albums) album-id)
        [album-id cover.album]
    :^  ~  ~  %albums-update
    !>  ^-  update
    [%album-id album-info]
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
++  on-arvo   on-arvo:def
++  on-fail   on-fail:def
--
