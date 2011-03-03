
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
      var diffInMs = this.getTime()-this.lastUpdate;
      this.lastUpdate = this.getTime();
      
      this.millisecondsLeft -= diffInMs;
      this.fireTickEvent();
      
      // Schedule next update.
      dt = 1000 - (this.getTime()-this.base)%1000;
      this.timer = setTimeout(function(thisObj) {thisObj.update();}, dt, this);
    },
    
    stop: function() {
      this.disposeCurrentWork();
      this.fireStoppedEvent();
    },
    
    finish: function() {
      this.disposeCurrentWork();
      this.fireFinishedEvent();
    },
    
    disposeCurrentWork: function() {
      this.timer = null;
      this.lastUpdate = null;
      this.millisecondsLeft = null;
    },
    
    fireStoppedEvent: function() {
      document.fire('pomodorotimer:stopped');
    },
    
    fireFinishedEvent: function() {
      document.fire('pomodorotimer:finished');
    },
    
    fireTickEvent: function() {
      var t = this.millisecondsLeft;

      var hours = Math.floor(t/60/60/1000);
      t = t-(hours*60*60*1000);
      
      var minutes = Math.floor(t/60/1000);
      t = t-(minutes*60*1000);
      
      var seconds = Math.round(t/1000);
    
      document.fire('pomodorotimer:tick', {milliseconds: this.millisecondsLeft, 
                         seconds: seconds, minutes: minutes, hours: hours});
    },
    
    getTime: function() {	
      var now = new Date;
      return now.getTime();
    }
  });