|%
+$  name  @t
+$  src  @t
+$  owner  @p
+$  comment  [who=@p when=@da what=@t]
+$  comments  ((mop @da comment) gth)
+$  image  [=src caption=comment =comments] 
+$  images  (list image)
+$  shared  (list @p)
+$  album-id  [=name =owner]
+$  album-ids  (list album-id)
+$  album  [=name =owner =shared =images]
+$  albums  (map album-id album)
+$  action
  $%  [%create =name] :: Create album
      [%nuke =album-id] :: Delete an album
      [%add =album-id =image] :: add an image
      [%del =album-id =image] :: delete an image
      [%comment =album-id =image =comment] :: add comment to an image
      [%share =album-id receiver=@p] :: share album with user
  ==
+$  update
  $%  [%album-id =album-ids]
      [%album =album]
  ==
--
