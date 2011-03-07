var pTimer;
var timeFromStore;

function setTime(evt) {
    var m = evt.memo.minutes;
	var s = evt.memo.seconds;
	if(m < 10) {
		m = '0'+m;
	}
	if(s < 10) {
		s = '0'+s;
	}
	$('value').innerHTML = m+':'+s;
}
function wirePomodoroEvents() {
	document.observe('pomodorotimer:started', function(evt) {
		jQuery('#overlay').hide();
		
		var selector = '#' + evt.memo.name;
		jQuery(selector).addClass('selected');
		jQuery('#display').css('-webkit-animation', 'none');
	});
	document.observe('pomodorotimer:tick', function(evt) {
		setTime(evt);
	});
	document.observe('pomodorotimer:finished', function(evt) {
		var selector = '#' + evt.memo.name;
		jQuery(selector).removeClass('selected');
		jQuery('#display').css('-webkit-animation', 'alarm 0.5s infinite');

		notify();
	});
	document.observe('pomodorotimer:stopped', function(evt) {
		var selector = '#' + evt.memo.name;
		jQuery(selector).removeClass('selected');
	});
	document.observe('pomodorotimer:unfinishedtimerfound', function(evt) {
		this.timeFromStore = evt.memo;
		setTime(evt);
		
		var selector = '#' + evt.memo.name;
		jQuery(selector).addClass('selected');
		
		var d = jQuery('#display');
		dTop = d.offset().top+'px';
		dLeft = d.offset().left+'px';
		dHeight = d.height()+'px';
		dWidth = d.width()+'px';
		
		jQuery('#overlay').css({
			'opacity' : 0.6,
			'position': 'absolute',
			'top': dTop,
			'left': dLeft,
			'height': dHeight,
			'width': dWidth,
			'background-color': 'black',
			'z-index': 5000
	      });
	});
}
function wireUserInterfaceCommandEvents() {
	$('pomodoro').observe('click', function(evt) {
		jQuery(this).addClass('selected');
		pTimer.startPomodoro();
		
		return false;
	});
	$('shortbreak').observe('click', function(evt) {
		jQuery(this).addClass('selected');
		pTimer.startShortBreak();

		return false;
	});
	$('longbreak').observe('click', function(evt) {
		jQuery(this).addClass('selected');
		pTimer.startLongBreak();

		return false;
	});
	$('resume').observe('click', function(evt) {
		var ms = this.timeFromStore.milliseconds;
		var name = this.timeFromStore.name;
		pTimer.start(ms, name);
	})
}
function init() {
	jQuery.noConflict();
	wirePomodoroEvents();
	wireUserInterfaceCommandEvents();
	
	pTimer = new PomodoroTimer();
}