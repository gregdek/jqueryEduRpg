// Bookkeeping.

mapset = new Object();
mapset.height = new Array();   
mapset.width= new Array();
mapset.terrain = new Array();  
mapset.startx = new Array();   /* Starting point for when no         */
mapset.starty = new Array();   /* other entry point is defined.      */
mapset.portals = new Array();  
  /* Portals are links to other maps.                         */
  /* Values 1 and 2: x+y of portal on this map.               */
  /* Value 3: id of destination map.                          */
  /* Values 4 and 5: x+y of landing spot on destination map.  */
mapset.objects = new Array();
  /* objects on the map are numbers or letters that refer to  */
  /* objects that will be defined in a separate object file   */

// Map Zero: The Home Map!

mapset.height[0] = 16;
mapset.width[0] = 16;
mapset.startx[0] = 2;
mapset.starty[0] = 2;

mapset.terrain[0] = 
 'xxxxxxxxxxxxxxxx' +
 'x______________x' +
 'x______________x' +
 'x__ooooooooo___x' +
 'x__________o___x' +
 'x__________o___x' +
 'x__________ooooo' +
 'x______________x' +
 'x______________x' +
 'x___xx______x__x' +
 'x___________x__x' +
 'x___x_______x__x' +
 'x______www_____x' +
 'x_____wwwww____x' +
 'x______www_____x' +
 'xxxxxxxxxxxxxxxx' ;

mapset.objects[0] =
 '                ' +
 ' 1              ' +
 '                ' +
 '                ' +
 '          2     ' +
 '                ' +
 '                ' +
 '    1           ' +
 '                ' +
 '                ' +
 '    0           ' +
 '                ' +
 '          1     ' +
 '                ' +
 '                ' +
 '                ';

mapset.portals[0] = [15,6,1,0,2];

mapset.height[1] = 8;
mapset.width[1] = 8;
mapset.startx[1] = 2;
mapset.starty[1] = 2;

// Map One: The Away Map!

mapset.terrain[1] = 
 'xxxxxxxx' + 
 'x______x' +
 'oooo___x' +
 'x__o___x' +
 'x__o___x' +
 'x____wwx' +
 'x____wwx' +
 'xxxxxxxx' ;

mapset.objects[1] =
 '        ' +
 '        ' +
 '    0   ' +
 ' 2      ' +
 '        ' +
 '    1   ' +
 '        ' +
 '        ';

mapset.portals[1] = [0,2,0,15,6];
