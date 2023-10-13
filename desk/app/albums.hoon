/-  *albums, hark
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
::%+  verb  &
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
    =/  name  (crip (replace:string " " "-" (trip name.act)))
    =/  owner  our.bowl
    =/  =shared  (malt (limo ~[[owner %.y]]))
    =/  =album  [name owner title.act comment-perm.act shared *images '' %.n]
    =/  =wire  /share/(scot %p owner)/[name]
    :-  ~[[%give %fact ~[wire] %albums-update !>(`update`[%album album])]]
    this(albums (~(put by albums) [name owner] album))
    ::
      %edit
    =,  act
    ?.  (~(has by albums) album-id)
      ~&  >  ["albums: Album not found" album-id]
      `this
    =/  album  (~(got by albums) album-id)
    =.  title.album  title
    =.  comment-perm.album  comment-perm
    =/  =wire  /share/(scot %p owner.album-id)/[name.album-id]
    :-  ~[[%give %fact ~[wire] %albums-update !>(`update`[%album album])]]
    this(albums (~(put by albums) album-id album))
    ::
      %cover
    =,  act
    ?.  (~(has by albums) album-id)
      ~&  >  ["albums: Album not found" album-id]
      `this
    =/  album  (~(got by albums) album-id)
    =.  cover.album  cover
    =/  =wire  /share/(scot %p owner.album-id)/[name.album-id]
    :-  ~[[%give %fact ~[wire] %albums-update !>(`update`[%album album])]]
    this(albums (~(put by albums) album-id album))
    ::
      %nuke
    =/  =album-id  +.act
    =/  =wire  /share/(scot %p owner.album-id)/[name.album-id]
    =/  album=album  (~(got by albums) album-id)
    :_  this(albums (~(del by albums) album-id))
    %-  zing
      %+  turn  ~(tap in ~(key by shared.album))
      |=  who=@p 
      ^-  (list card)
      :~  [%pass /archive %agent [who dap.bowl] %poke %albums-action !>([%archive album-id])]
          [%give %kick ~[wire] `who]
      ==
    ::
      %add
    =,  act
    ?.  (~(has by albums) album-id)
      ~&  >  ["albums: Album not found" album-id]
      `this
    =/  album  (~(got by albums) album-id)
    ?.  =(our.bowl owner.album-id)
      :_  this
      :~  [%pass /add %agent [owner.album dap.bowl] %poke %albums-action !>(act)]
      == 
    =/  shared=(unit write-perm)  (~(get by shared.album) src.bowl)
    ?~  shared  `this
    ?.  =(u.shared %.y)
      ~&  >  ["albums: We havent shared the album with this person" src.bowl]
      `this
    =/  img=image  [src caption *comments]
    =/  new-album  %=  album
    images  (~(put by images.album) img-id img)
    ==
    =/  =wire  /share/(scot %p owner.album-id)/[name.album-id]
    =/  con=(list content:hark)  [(crip "{(trip (scot %p src.bowl))} added new photo to {(trip title.new-album)}") ~]
    =/  =id:hark      (end 7 (shas %albums-notification eny.bowl))
    =/  =rope:hark    [~ ~ q.byk.bowl /(scot %p our.bowl)/[dap.bowl]]
    =/  =action:hark  [%add-yarn & & id rope now.bowl con /(scot %p owner.new-album)/[name.new-album]/[img-id] ~]
    =/  =cage         [%hark-action !>(action)]
    :_  this(albums (~(put by albums) album-id new-album))
    ?.  .^(? %gu /(scot %p our.bowl)/hark/(scot %da now.bowl)/$)
      :~  [%give %fact ~[wire] %albums-update !>(`update`[%album new-album])]
      ==
    ?:  =(owner.album-id src.bowl)
      :~  [%give %fact ~[wire] %albums-update !>(`update`[%album new-album])]
      ==
    :~  [%give %fact ~[wire] %albums-update !>(`update`[%album new-album])]
        [%pass /hark %agent [our.bowl %hark] %poke cage]
    ==
    ::
      %del
    =,  act
    ?.  (~(has by albums.this) album-id)
      ~&  >  ["albums: Album not found" album-id]
      `this
    =/  album  (~(got by albums) album-id)
    ?.  =(our.bowl owner.album-id)
      :_  this
      :~  [%pass /del %agent [owner.album dap.bowl] %poke %albums-action !>(act)]
      == 
    =/  shared=(unit write-perm)  (~(get by shared.album) src.bowl)
    ?~  shared  `this
    ?.  =(u.shared %.y)
      ~&  >  ["albums: We havent shared the album with this person" src.bowl]
      `this
    =/  img-list  ~(key by images.album)
    ?.  (~(has in img-list) img-id)
      ~&  >  ["albums: Image not found" img-id]
      `this
    =/  =image  (~(got by images.album) img-id)
    =.  images.album  (~(del by images.album) img-id)
    =.  cover.album  
      ?.  =(src.image cover.album)  cover.album  ''
    =/  =wire  /share/(scot %p owner.album-id)/[name.album-id]
    :-  ~[[%give %fact ~[wire] %albums-update !>(`update`[%album album])]]
    this(albums (~(put by albums) album-id album))
    ::  
      %comment
    =,  act
    =/  album=(unit album)  (~(get by albums.this) album-id)
    ?~  album
      ~&  >  ["albums: Album not found" album-id]
      `this
    ?.  comment-perm.u.album  `this
    =/  img-list  ~(key by images.u.album)
    ?.  (~(has in img-list) img-id)
      ~&  >  ["albums: Image not found" img-id]
      `this
    :: make sure we own the album if not poke the owner with the comment
    ?.  =(owner.u.album our.bowl)
      ~&  >  ["albums: We don't own the album" who.comment owner.u.album]
      :_  this 
      :~  [%pass /comment %agent [owner.u.album dap.bowl] %poke %albums-action !>(act)]
      ==
    =/  shared=(list @p)  ~(tap in ~(key by shared.u.album))
    ?~  (find ~[who.comment] shared)
      ~&  >  ["albums: We havent shared the album with this person" who.comment]
      `this
    =/  old-image  (~(got by images.u.album) img-id)
    =/  comments  comments.old-image
    =/  new-image  old-image(comments (put:comment-on comments when.comment comment))
    =/  new-album  u.album(images (~(put by images.u.album) img-id new-image))
    =/  =wire  /share/(scot %p owner.album-id)/[name.album-id]
    =/  con=(list content:hark)  [(crip "New comment in album: {(trip title.new-album)}") ~]
    =/  =id:hark      (end 7 (shas %albums-notification eny.bowl))
    =/  =rope:hark    [~ ~ q.byk.bowl /(scot %p our.bowl)/[dap.bowl]]
    =/  =action:hark  [%add-yarn & & id rope now.bowl con /(scot %p owner.album-id)/[name.album-id]/[img-id] ~]
    =/  =cage         [%hark-action !>(action)]
    :_  this(albums (~(put by albums) album-id new-album))
      ?.  .^(? %gu /(scot %p our.bowl)/hark/(scot %da now.bowl)/$)
        :~  [%give %fact ~[wire] %albums-update !>(`update`[%album new-album])]
        ==
      ?:  =(who.comment our.bowl)
        :~  [%give %fact ~[wire] %albums-update !>(`update`[%album new-album])]
        ==
      :~  [%give %fact ~[wire] %albums-update !>(`update`[%album new-album])]
        [%pass /hark %agent [our.bowl %hark] %poke cage] 
      ==
      %share
    =,  act
    ?>  =(src.bowl owner.album-id)
    ?:  =(src.bowl our.bowl) :: If we're adding someone to shared list
      =/  new-album  (~(got by albums) album-id)
      =/  =wire  /share/(scot %p owner.album-id)/[name.album-id]
      =.  shared.new-album  (~(put by shared.new-album) receiver write-perm)
      :_  this(albums (~(put by albums) album-id new-album))
      :~  [%pass wire %agent [receiver dap.bowl] %poke %albums-action !>(act)]
      ==
    =/  =wire  /share/(scot %p owner.album-id)/[name.album-id]
    :_  this
    :~  [%pass wire %agent [src.bowl dap.bowl] %watch wire]
    ==
    ::
      %unshare
    =,  act
    ?>  =(src.bowl owner.album-id)
    =/  =wire  /share/(scot %p owner.album-id)/[name.album-id]
    =/  new-album  (~(got by albums) album-id)
    =.  shared.new-album  (~(del by shared.new-album) receiver)
    :_  this(albums (~(put by albums) album-id new-album))
    :~  [%give %kick ~[wire] `receiver]
        [%pass /archive %agent [receiver dap.bowl] %poke %albums-action !>([%archive album-id])]
    ==
    ::
      %archive 
    =,  act
    =/  new-album  (~(got by albums) album-id)
    =.  archive.new-album  %.y
    [~ this(albums (~(put by albums) album-id new-album))]
  ==
::
++  on-agent
  |=  [=(pole knot) =sign:agent:gall]
  ^-  (quip card _this)
  ?.  ?=([%share owner=@ name=@ ~] pole)  `this
    :: switch on the type of event
    ::
    ?+    -.sign  (on-agent:def pole sign)
      ::
        %fact
      ?>  ?=(%albums-update p.cage.sign)
      =/  =update  !<(update q.cage.sign)
      ?.  ?=(%album -.update)  `this
      ?:  (~(has by albums) [name.album.update owner.album.update])
        :-  ~
        this(albums (~(put by albums) [name.album.update owner.album.update] album.update))
      =/  con=(list content:hark)  [(crip "New album shared: {(trip title.album.update)}") ~]
      =/  =id:hark      (end 7 (shas %albums-notification eny.bowl))
      =/  =rope:hark    [~ ~ q.byk.bowl /(scot %p our.bowl)/[dap.bowl]]
      =/  =action:hark  [%add-yarn & & id rope now.bowl con /(scot %p owner.album.update)/[name.album.update] ~]
      =/  =cage         [%hark-action !>(action)]
      :-  
      ?.  .^(? %gu /(scot %p our.bowl)/hark/(scot %da now.bowl)/$)
        ~
      ~[[%pass /hark %agent [our.bowl %hark] %poke cage]]
      this(albums (~(put by albums) [name.album.update owner.album.update] album.update))
      :: if we've been kicked from the subscription,
      :: automatically resubscribe
      ::
        %kick
      :_  this
      :~  [%pass pole %agent [src.bowl dap.bowl] %watch /'share'/[owner.pole]/[name.pole]]
      ==
        ::%watch-ack
      ::?~  p.sign
        ::((slog '%albums: Subscribe succeeded!' ~) `this)
      ::((slog '%albums: Subscribe failed!' ~) `this)
    ==
::
++  on-watch
  ::
  |=  =(pole knot)
  ^-  (quip card _this)
  ::?>  (team:title our.bowl src.bowl)
  ?+  pole  (on-watch:def pole)
      [%share owner=@ name=@ ~]
    =/  album=(unit album)  (~(get by albums.this) [name.pole +:(slaw %p `@ta`owner.pole)])
    ?~  album  `this
    =/  shared=(list @p)  ~(tap in ~(key by shared.u.album))
    ?~  (find ~[src.bowl] shared)
      ~&  >  ["albums: We havent shared the album with this person" src.bowl]
      `this
    :_  this
    :~  [%give %fact ~[pole] %albums-update !>([%album u.album])]
    ==
  ==
::
++  on-peek
  |=  =path
  ^-  (unit (unit cage))
  ::?>  (team:title our.bowl src.bowl)
  =/  now  now.bowl
  ?+  path  (on-peek:def path)
      [%x %list ~]
    =/  =album-ids  ~(tap in ~(key by albums))
    =/  album-info  %+  turn  album-ids
      |=  =album-id
      =/  =album  (~(got by albums) album-id)
        [album-id cover.album title.album]
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
