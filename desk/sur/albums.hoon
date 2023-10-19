|%
+$  name  @t
+$  src  @t
+$  img-id  @t
+$  owner  @p
+$  title  @t
+$  archive  ?
+$  write-perm  ?
+$  comment-perm  ?
+$  comment  [who=@p when=@da what=@t]
+$  comments  ((mop @da comment) gth)
+$  image  [=src caption=comment =comments] 
+$  images  (map img-id image)
+$  shared  (map who=@p =write-perm)
+$  album-id  [=name =owner]
+$  album-ids  (list album-id)
+$  album  [=name =owner =title =comment-perm =shared =images cover=src =archive]
+$  albums  (map album-id album)
+$  action
  $%  [%create =name =title =comment-perm] :: Create album
      [%nuke =album-id] :: Delete an album
      [%edit =album-id =title =comment-perm] :: edit an album
      [%cover =album-id cover=src]
      [%add =album-id =img-id =src caption=comment] :: add an image
      [%del =album-id =img-id] :: delete an image
      [%edit-img =album-id =img-id =src caption=comment] :: edit an image
      [%comment =album-id =img-id =comment] :: add comment to an image
      [%share =album-id receiver=@p =write-perm] :: share album with user
      [%unshare =album-id receiver=@p] :: unshare album with user
      [%archive =album-id] :: unshare album with user
  ==
+$  update
  $%  [%album-id album-info=(list [album-id cover=src =title =archive])]
      [%album =album]
  ==
--
