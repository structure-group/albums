/-  *albums
/+  *etch
|%
++  enjs-update
  |=  upd=update
  ^-  json
  =/  u  ;;(update upd) 
  ?-  -.u  
      %album-id
    (en-vase !>(+.u)) 
      %album
    (en-vase !>(+.u))
  ==
++  dejs-action
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
        ::[%add dejs-add]
      ::[%add =album-id =src =comment] :: add an image
      ::[%del =album-id =src] :: delete an image
      ::[%comment =album-id =src =comment] :: add comment to an image
      ::[%share =album-id receiver=@p] :: share album with user
    ==
  ++  dejs-create
    %-  ot  ~[name+so]
  ++  dejs-nuke
    %-  ot  ~[name+so owner+(se %p)]
  ::++  dejs-add
    ::%-  ot
      :::~  
        ::~[%album-id (ot ~[name+so owner+(se %p)])]
        ::src+so
        :::~  %comment 
        ::%-  ot
          :::~
            ::[%who (se %p)]
            ::[%what so]
            ::[%when sd]
          ::==
        ::==
      ::==
  --
--
