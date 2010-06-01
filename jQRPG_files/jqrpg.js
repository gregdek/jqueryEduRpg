/* google.setOnLoadCallback(function() { */
$(function() {

// only call this once
function jqrpgBuildInterface() {
	$('#jqrpg_wrapper').width($('#jqrpg_screen').width());
}

// call at the start of each level
function jqrpgBuildMapHtml() {
	$('#jqrpg_screen, #jqrpg_wrapper').height(jqr.map.height 
           * jqr.settings.sprite_height)
	   .width(jqr.map.width * jqr.settings.sprite_width);
	m = $('#jqrpg_map');
	m.empty();
	for (y = 0; y < jqr.map.height; y++) {
		for (x = 0; x < jqr.map.width; x++) {
			// cti = y * x; // current_tile_index
			// <![CDATA[
			m.append('<span>.</span>');
			// ]]>
		}
	}
}

function jqrpgResetPlayer() {
	jqr.p.face = 'd';
	jqr.p.x = mapset.startx[jqr.settings.currentMapId];
	jqr.p.y = mapset.starty[jqr.settings.currentMapId];
	jqr.p.state = 'map';
        // inventory is simple for now.  Items are just
        // counts in an array.
        jqr.p.inventory = new Array();
        for (i = 0; i < jqr.settings.maxItemTypes; i++) {
                jqr.p.inventory[i] = 0;
        }
}

function jqrpgResetMap(mapId) {
    jqr.map.height 	= mapset.height[mapId];
    jqr.map.width 	= mapset.width[mapId];
    jqr.map.terrain	= mapset.terrain[mapId];
    jqr.map.portals     = mapset.portals[mapId];
    jqr.map.objects     = mapset.objects[mapId];
}

// Call this whenever a new screen is entered 
function jqrpgUpdateMapClasses() {
	for (y = 0; y < jqr.map.height; y++) {
		for (x = 0; x < jqr.map.width; x++) {
			cti = y * jqr.map.height + x; // current_tile_index
			ct = $('#jqrpg_map span').eq(cti);
			ct.removeClass()
			 .addClass('tile')
			 .addClass('tile_x' + x + 'y'+ y)
			 .addClass('tile_' + jqr.map.terrain[cti]);
			if (y && x == 0) ct.addClass('tile_row');
		}
	}
	$('#jqrpg_map').fadeIn('slow');
}

function jqrpgUpdateObjects() {
        objId = 0;  //
	for (y = 0; y < jqr.map.height; y++) {
		for (x = 0; x < jqr.map.width; x++) {
			cti = y * jqr.map.height + x; // current_tile_index
                        if (jqr.map.objects[cti] != ' ') {
                            objOnMap = '#jqrpg_object' + objId;
                            $(objOnMap).css({
                                'left' : x * jqr.settings.sprite_width,
                                'top' : y * jqr.settings.sprite_height
                            });
                            objSpriteType = 'object_' + 
                              jqr.map.objects[cti];
                            $(objOnMap).removeClass().addClass(objSpriteType).addClass('sprites').addClass('tile_x' + x + 'y'+ y);
                            objId++;
                        }
		}
        }
        jqr.map.objectCount = objId;
}

function jqrpgSetPlayerFace(new_face) {
	$('#jqrpg_player').removeClass().addClass('face_' + new_face).addClass('sprites');
}

function jqrpgSetPlayer(new_x, new_y) {
	$('#jqrpg_player').css({
	 'left' : new_x * jqr.settings.sprite_width,
	 'top' : new_y * jqr.settings.sprite_height
	});
}

// Key binding function
function jqrpgBindKeys() {
	$(document).bind('keydown', 'up', function() {
		if (jqr.p.state != 'map') return false;
		jqrpgSetPlayerFace('u');
		return jqrpgMovePlayer(0, -1);
	})
	.bind('keydown', 'Down', function() {
		if (jqr.p.state != 'map') return false;
		jqrpgSetPlayerFace('d');
		return jqrpgMovePlayer(0, 1);
	})
	.bind('keydown', 'Left', function() {
		if (jqr.p.state != 'map') return false;
		jqrpgSetPlayerFace('l');
		return jqrpgMovePlayer(-1, 0);
	})
	.bind('keydown', 'Right', function() {
		if (jqr.p.state != 'map') return false;
		jqrpgSetPlayerFace('r');
		return jqrpgMovePlayer(1, 0);
	})
	.bind('keydown', 'a', function() {
		// if (console) console.log('space');
		if (jqr.p.state == 'map') return false;
		jqr.settings.space = true;
		if (jqr.p.state == 'battle') jqrpgBattle('a');
		return true;
	})
	.bind('keydown', 'b', function() {
		// if (console) console.log('space');
		if (jqr.p.state == 'map') return false;
		jqr.settings.space = true;
		if (jqr.p.state == 'battle') jqrpgBattle('b');
		return true;
	})
	.bind('keydown', 'c', function() {
		// if (console) console.log('space');
		if (jqr.p.state == 'map') return false;
		jqr.settings.space = true;
		if (jqr.p.state == 'battle') jqrpgBattle('c');
		return true;
	});
}

// Player movement function
function jqrpgMovePlayer(new_x, new_y) {

  	// is new_x, new_y a legal move?

	if (jqr.p.x + new_x + 1 > jqr.map.width
	 || jqr.p.y + new_y + 1 > jqr.map.height
	 || jqr.p.x + new_x + 1 == 0
	 || jqr.p.y + new_y + 1 == 0
	 || !jqrpgIsTileWalkable(jqr.p.x + new_x, jqr.p.y + new_y)
	) return;


        // will new_x, new_y take us to a new map?
        // return with new map and new coords.

        for (count=0; count<=jqr.map.portals.length; count+=5) {
            if (jqr.p.x + new_x == jqr.map.portals[count] 
             && jqr.p.y + new_y == jqr.map.portals[count+1]
            ) {
              jqr.settings.currentMapId = jqr.map.portals[count+2];
              jqr.p.x = jqr.map.portals[count+3];
              jqr.p.y = jqr.map.portals[count+4];
              jqrpgResetMap(jqr.settings.currentMapId);
              jqrpgBuildMapHtml();
              jqrpgUpdateMapClasses();
	      jqr.p.state = 'map';
              jqrpgSetPlayerFace(jqr.p.face);
              jqrpgSetPlayer(jqr.p.x, jqr.p.y);
              jqrpgUpdateObjects();
              return;
            }
        }

        // Move is successful!  Set new coords.
	jqr.p.x += new_x;	jqr.p.y += new_y;

        // Is there an object present?  Pick it up!
        objectClassId = "tile_x" + jqr.p.x + "y" + jqr.p.y;
        for (count=0; count<=jqr.map.objectCount; count++) {
            if ($('#jqrpg_object'+count).hasClass(objectClassId)) {
                 for (count2=0; count2<=jqr.settings.itemTypeCount; count2++) {
                     if ($('#jqrpg_object'+count).hasClass('object_'+count2)) {
                         // alert("found object " + count2);
                         jqr.p.inventory[count2] += 1;
                     }
                 }
                 // Remove from screen.
	         $('#jqrpg_object'+count).removeClass().addClass('sprites');
                 // Remove from the mapset too, or it'll come back!
		 cti = jqr.p.y * jqr.map.height + jqr.p.x; 
                 newMapsetObjects =
                    mapset.objects[jqr.settings.currentMapId].slice(0,cti) +
                    ' '+
                    mapset.objects[jqr.settings.currentMapId].slice(cti+1);
                 mapset.objects[jqr.settings.currentMapId] = newMapsetObjects;
            }
        }

        // Now let's animate our move! 
	$('#jqrpg_player').dequeue().animate({
	 left: jqr.p.x * jqr.settings.sprite_width,
	 top: jqr.p.y * jqr.settings.sprite_height
	},
	250,
	function() {
		jqrpgGetRandomBattle();
	});
	return true;
}

function jqrpgIsTileWalkable(x, y) {
	return jQuery.inArray(jqr.map.terrain[(y) * jqr.map.width + x], 
               jqr.map.terrain_walkable) > -1;
}

// Battle functions
function jqrpgGetRandomBattle() {
        // setting to a very low likelihood for testing
	var likelihood = Math.floor(Math.random() * 1000) + 1;
	if (likelihood == 1) {
		jqrpgBattleInit();
	}
}

function jqrpgBattleInit() {
	jqr.p.state = 'battle';
        jqr.quizQuestionsAsked += 1;
        var questionNumber = Math.floor(Math.random() * quiz.answers.length);
        jqr.settings.quizCurrentAnswer = quiz.answers[questionNumber];
	m = $('#jqrpg_menu');
	m.show();
	// <![CDATA[
        m.html(function() {
           return quiz.questions[questionNumber];
        });
	// ]]>
	$('#jqrpg_wrapper').css({'border-color' : '#00a'});
}

function jqrpgBattle(battleAnswer) {
	// if (jqr.settings.space) {
	if (battleAnswer == jqr.settings.quizCurrentAnswer) {
		// jqr.settings.space = false;
		jqr.settings.quizCurrentAnswer = '';
		jqrpgBattleEnd('win');
	} else {
                jqr.settings.quizCurrentAnswer = '';
                jqrpgBattleEnd('fail');
        }
}

function jqrpgBattleEnd(winOrLose) {
	jqr.p.state = 'map';
        if (winOrLose == 'win') {
            jqr.quizCorrectAnswers += 1;
            m.html(function() {
               return "Win! " + jqr.quizCorrectAnswers + "/" + 
               jqr.quizQuestionsAsked;
            });
        } else {
            m.html(function() {
               return "Fail! " + jqr.quizCorrectAnswers + "/" + 
               jqr.quizQuestionsAsked;
            });
        }
        m.fadeOut('slow');
	$('#jqrpg_wrapper').css({'border-color' : '#000'});
}

// *****************
// MAIN PROGRAM LOOP
// *****************

jqr = new Object();
jqr.settings = new Object();
jqr.settings.sprite_width = 16;
jqr.settings.sprite_height = 16;
jqr.settings.space = false;
jqr.settings.currentAnswer = '';
jqr.settings.currentMapId = 0;
jqr.settings.itemTypeCount = 3;

jqr.p = new Object();

jqr.map = new Object();
jqr.map.terrain_walkable = [ '_', 'o' ];

jqrpgResetMap(jqr.settings.currentMapId);

jqr.quizQuestionsAsked = 0;
jqr.quizCorrectAnswers = 0;

jqr.battle = new Object();

jqrpgBuildMapHtml();
jqrpgUpdateMapClasses();
jqrpgResetPlayer();
jqrpgSetPlayerFace(jqr.p.face);
jqrpgSetPlayer(jqr.p.x, jqr.p.y);
jqrpgUpdateObjects();
jqrpgBindKeys();

});
