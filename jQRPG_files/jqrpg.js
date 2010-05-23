/* google.setOnLoadCallback(function() { */
$(function() {

jqr = new Object();
jqr.settings = new Object();
jqr.settings.sprite_width = 16;
jqr.settings.sprite_height = 16;
jqr.settings.space = false;
jqr.settings.currentAnswer = '';
jqr.settings.currentMapId = 0;

jqr.p = new Object();
function jqrpgResetPlayer() {
	jqr.p.face = 'd';
	jqr.p.x = mapset.startx[jqr.settings.currentMapId];
	jqr.p.y = mapset.starty[jqr.settings.currentMapId];
	jqr.p.state = 'map';
}

jqr.map = new Object();
jqr.map.terrain_walkable = [ '_', '1' ];

function jqrpgResetMap(mapId) {
    jqr.map.height 	= mapset.height[mapId];
    jqr.map.width 	= mapset.width[mapId];
    jqr.map.terrain	= mapset.picture[mapId];
}

jqrpgResetMap(jqr.settings.currentMapId);

jqr.quizQuestionsAsked = 0;
jqr.quizCorrectAnswers = 0;

jqr.battle = new Object();

jqrpgBuildMapHtml();
jqrpgUpdateMapClasses();
jqrpgResetPlayer();
jqrpgSetPlayerFace(jqr.p.face);
jqrpgSetPlayer(jqr.p.x, jqr.p.y);
jqrpgBindKeys();

/**
 * only call this once
 */
function jqrpgBuildInterface() {
	$('#jqrpg_wrapper').width($('#jqrpg_screen').width());
}
function jqrpgBuildMapHtml() {
	$('#jqrpg_screen, #jqrpg_wrapper').height(jqr.map.height * jqr.settings.sprite_height)
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

/**
 * call this whenever enter a new screen
 */
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
function jqrpgSetPlayerFace(new_face) {
	$('#jqrpg_player').removeClass().addClass('face_' + new_face);
}
function jqrpgSetPlayer(new_x, new_y) {
	$('#jqrpg_player').css({
	 'left' : new_x * jqr.settings.sprite_width,
	 'top' : new_y * jqr.settings.sprite_height
	});
}

/**
 * key binding
 */
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

/**
 * movement
 */
function jqrpgMovePlayer(new_x, new_y) {
  	// if (console) console.log('x: ' + jqr.p.x + '  y: ' + jqr.p.y);
	if (jqr.p.x + new_x + 1 > jqr.map.width
	 || jqr.p.y + new_y + 1 > jqr.map.height
	 || jqr.p.x + new_x + 1 == 0
	 || jqr.p.y + new_y + 1 == 0
	 || !jqrpgIsTileWalkable(jqr.p.x + new_x, jqr.p.y + new_y)
	) return;
	jqr.p.x += new_x;	jqr.p.y += new_y;
	
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
	return jQuery.inArray(jqr.map.terrain[(y) * 16 + x], jqr.map.terrain_walkable) > -1;
}
/**
 * battle
 */
function jqrpgGetRandomBattle() {
	var likelihood = Math.floor(Math.random() * 6) + 1;
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
               return "Win! " + jqr.quizCorrectAnswers + "/" + jqr.quizQuestionsAsked;
            });
        } else {
            m.html(function() {
               return "Fail! " + jqr.quizCorrectAnswers + "/" + jqr.quizQuestionsAsked;
            });
        }
        m.fadeOut('slow');
	$('#jqrpg_wrapper').css({'border-color' : '#000'});
}

});
