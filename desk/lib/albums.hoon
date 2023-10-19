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
    =/  album-info=(list [=album-id cover=src title=@t archive=?])  +.u
    %+  frond  'album-id'
    :-  %a
    %+  turn  album-info
    |=  [=album-id cover=src title=@t =archive]
    ^-  ^json
      (en-vase !>([name=name.album-id owner=owner.album-id cover=cover title=title archive=archive])) 
      %album
    =/  =album  +.u
    %+  frond  'albums'
    %-  pairs
    =/  imgs=(list [=img-id =image])  ~(tap by images.album)
    =/  shared=(list [who=@p write-perm=?])  ~(tap by shared.album)
    :~  ['name' (en-vase !>(name.album))]
        ['owner' (en-vase !>(owner.album))]
        :-  'shared'
          :-  %a
          %+  turn  shared
          |=  [who=@p write-perm=?]
          ^-  json
            (en-vase !>([who write-perm]))
        :-  'images'
          :-  %a
          %+  turn  imgs
          |=  [=img-id =image]
          ^-  ^json
            (enjs-images img-id image)
        ['cover' (en-vase !>(cover.album))]
        ['title' (en-vase !>(title.album))]
        ['comment-perm' (en-vase !>(comment-perm.album))]
        ['archive' (en-vase !>(archive.album))]
    ==
  ==

++  enjs-images
  |=  [=img-id =image]
  =,  enjs:format
  ^-  ^json
  =/  comments=(list comment)  ~(val by comments.image)
  :-  %a
  :~  s+img-id
    %-  pairs
    :~  ['src' s+src.image]
        ['caption' (en-vase !>(caption.image))]
        :-  'comments'
        :-  %a  %+  turn  comments
        |=  [who=@p when=@da what=@t]
        ^-  ^json
        =/  =comment  [who when what]
        :-  %a
        :~  s+(scot %da when)
        (en-vase !>(comment))
        ==
    ==
  ==

++  dejs-action
  !:
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
        [%edit-img dejs-edit-img]
        [%share dejs-share]
        [%unshare dejs-unshare]
        [%edit dejs-edit]
        [%cover dejs-cover]
    ==
  ++  dejs-create
    %-  ot  
      :~
        [name+so]
        [title+so]
        [comment-perm+bo]
      ==
  ++  dejs-nuke
    %-  ot  ~[name+so owner+(se %p)]
  ++  dejs-add
    %-  ot
      :~  
        [%album-id (ot ~[name+so owner+(se %p)])]
        img-id+so
        src+so
        [%caption (ot ~[who+(se %p) when+sd what+so])]
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
        [%comment (ot ~[who+(se %p) when+sd what+so])]
      ==
  ++  dejs-edit-img
    %-  ot
      :~  
        [%album-id (ot ~[name+so owner+(se %p)])]
        img-id+so
        src+so
        [%caption (ot ~[who+(se %p) when+sd what+so])]
      ==
  ++  dejs-share
    %-  ot
      :~  
        [%album-id (ot ~[name+so owner+(se %p)])]
        receiver+(se %p)
        write-perm+bo 
      ==
  ++  dejs-unshare
    %-  ot
      :~  
        [%album-id (ot ~[name+so owner+(se %p)])]
        receiver+(se %p)
      ==
  ++  dejs-cover
    %-  ot
      :~
        [%album-id (ot ~[name+so owner+(se %p)])]
        [cover+so]
      ==
  ++  dejs-edit
    %-  ot  
      :~
        [%album-id (ot ~[name+so owner+(se %p)])]
        [title+so]
        [comment-perm+bo]
      ==
  --
--
