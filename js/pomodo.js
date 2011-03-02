
  function init() {
	var p = new PomodoroTimer();
	p.start();
	
	document.observe('pomodorotimer:tick', function(evt) {
		$('t').innerHTML = evt.memo.timeText;
	});
  }

  var PomodoroTimer = Class.create({
  
	initialize: function() {
		this.total = 0.0;
	},
  
	start: function(milliseconds) {
		this.millisecondsLeft = milliseconds;
		this.base = this.getTime();
		this.lastUpdate = this.base;
		
		document.fire('pomodorotimer:started');
		this.update();
	},
	
	update: function() {
		this.secondsLeft;
		
		var diffInMs = this.getTime()-this.lastUpdate;
		this.millisecondsLeft -= diffInMs;
		
		// Update time and fire tick event.
		this.lastUpdate = this.getTime();
		this.fireTickEvent();
		
		// Schedule next update.
		dt = 1000 - (this.getTime()-this.base)%1000;
		this.timer = setTimeout(function(thisObj) {thisObj.update();}, dt, this);
	},
	
	fireTickEvent: function() {
		document.fire('pomodorotimer:tick', {millisecondsLeft: this.millisecondsLeft});
	},
	
	getTime: function() {	
		var now = new Date;
		return now.getTime();
	}
  });
