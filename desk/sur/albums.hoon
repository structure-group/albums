|%
+$  name  @
+$  src  @t
+$  owner  @p
+$  image  [=src comments=(list [@p @da @t])] 
+$  album  [=name =owner images=(list image)]
+$  albums  (map [owner name] album)
+$  action
  $%  [%create =name]
      [%nuke =owner =name]
      [%add [=owner =name] =image]
      [%del [=owner =name] =image]
  ==
--
