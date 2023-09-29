/-  *albums
/+  *etch
|%
++  enjs-update
  |=  upd=update
  =,  enjs:format
  ^-  ^json
  =/  u  ;;(update upd) 
  ?-  -.u  
      %album-id
    =/  album-info=(list [=album-id cover=src])  +.u
    ~&  +.u
    %+  frond  'album-id'
    :-  %a
    %+  turn  album-info
    |=  [=album-id cover=src]
    ^-  ^json
      (en-vase !>([album-id cover])) 
      %album
    =/  =album  +.u
    %+  frond  'albums'
    %-  pairs
    =/  imgs=(list [=img-id =image])  ~(tap by images.album)
    :~  ['name' (en-vase !>(name.album))]
        ['owner' (en-vase !>(owner.album))]
        ['shared' (en-vase !>(shared.album))]
        :-  'images'
          :-  %a
          %+  turn  imgs
          |=  [=img-id =image]
          ^-  ^json
            (en-vase !>([img-id image]))
        ['cover' (en-vase !>(cover.album))]
    ==
  ==

++  dejs-action
  ::!.
  =,  dejs:format
  |=  jon=json
  ^-  action
  =<  (decode jon)
  |%
  ++  decode
    %-  of
      :~
        [%create dejs-create]
        [%nuke dejs-nuke] :: Delete an album
        [%add dejs-add]
        [%del dejs-del]
        [%comment dejs-comment]
        [%share dejs-share]
    ==
  ++  dejs-create
    %-  ot  ~[name+so]
  ++  dejs-nuke
    %-  ot  ~[name+so owner+(se %p)]
  ++  dejs-add
    %-  ot
      :~  
        [%album-id (ot ~[name+so owner+(se %p)])]
        img-id+so
        src+so
        [%caption (ot ~[who+(se %p) when+nu what+so])]
      ==
  ++  dejs-del
    %-  ot  
      :~  [%album-id (ot ~[name+so owner+(se %p)])]
          [%img-id so]
      ==
  ++  dejs-comment
    %-  ot
      :~  
        [%album-id (ot ~[name+so owner+(se %p)])]
        img-id+so
        [%comment (ot ~[who+(se %p) when+nu what+so])]
      ==
  ++  dejs-share
    %-  ot
      :~  
        [%album-id (ot ~[name+so owner+(se %p)])]
        receiver+(se %p)
        write-perm+bo 
      ==

  --
--
