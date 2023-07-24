|%
+$  name  @t
+$  src  @t
+$  owner  @p
+$  comment  [@p @da @t]
+$  comments  ((mop @da comment) gth)
+$  image  [=src caption=comment =comments] 
+$  album  [=name =owner images=(list image)]
+$  albums  (map [owner name] album)
+$  action
  $%  [%create =name] :: Create album
      [%nuke =owner =name] :: Delete an album
      [%add [=owner =name] =image] :: add an image
      [%del [=owner =name] =image] :: delete an image
  ==
--
