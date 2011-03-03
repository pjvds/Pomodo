
  var PomodoroTimer = Class.create({
    
    initialize: function() {
      this.total = 0.0;
    },
    
    start: function(milliseconds) {
      if(this.timer) {
        this.stop();
      }
    
      this.millisecondsLeft = milliseconds;
      this.base = this.getTime();
      this.lastUpdate = this.base;
      
      this.fireStartedEvent(this.millisecondsLeft);
      this.update();
    },
    
    startPomodoro: function() {
      this.start((25*60*1000)+999);
    },
    
    startShortBreak: function() {
      this.start((1*10*1000)+999);
    },
    
    startLongBreak: function() {
      this.start((10*60*1000)+999);
    },
    
    fireStartedEvent: function (timeInMilliseconds) {
      var e = this.createTimeEventArgs(timeInMilliseconds);
      document.fire('pomodorotimer:started', e);
    },
    
    update: function() {
      var diffInMs = this.getTime()-this.lastUpdate;
      this.lastUpdate = this.getTime();
      
      this.millisecondsLeft -= diffInMs;

      if(this.millisecondsLeft > 0) {
        this.fireTickEvent(this.millisecondsLeft);
        this.scheduleNextUpdate();
      }else{
        this.millisecondsLeft = 0;
        this.fireTickEvent(0);
        this.finish();
      }
    },
    
    scheduleNextUpdate: function() {
      // Schedule next update.
      dt = 250 - (this.getTime()-this.base)%250;
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
      if(this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      
      this.lastUpdate = null;
      this.millisecondsLeft = null;
    },
    
    fireStoppedEvent: function() {
      document.fire('pomodorotimer:stopped');
    },
    
    fireFinishedEvent: function() {
      document.fire('pomodorotimer:finished');
    },
    
    fireTickEvent: function(millisecondsLeft) {
      var e = this.createTimeEventArgs(millisecondsLeft);
    
      document.fire('pomodorotimer:tick', e);
    },
    
    createTimeEventArgs: function(millisecondsLeft) {
      var t = millisecondsLeft;
      
      var minutes = Math.floor(t/60/1000);
      t = t-(minutes*60*1000);
      
      var seconds = Math.floor(t/1000);
      
      return {milliseconds: this.millisecondsLeft, 
               seconds: seconds, minutes: minutes};
    },
    
    getTime: function() {	
      var now = new Date;
      return now.getTime();
    }
  });