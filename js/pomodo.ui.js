var pTimer;
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
}
function wireUserInterfaceCommandEvents() {
	$('pomodoro').observe('click', function(evt) {
		jQuery(this).addClass('selected');
		pTimer.startPomodoro();
	});
	$('shortbreak').observe('click', function(evt) {
		jQuery(this).addClass('selected');
		pTimer.startShortBreak();
	});
	$('longbreak').observe('click', function(evt) {
		jQuery(this).addClass('selected');
		pTimer.startLongBreak();
	});
}
function init() {
	jQuery.noConflict();
	pTimer = new PomodoroTimer();
	wirePomodoroEvents();
	wireUserInterfaceCommandEvents();
}