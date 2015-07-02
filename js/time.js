function Time() {
	var startTime,
	timeStarted,
	stoppedTime,
	timescale = 1;

	this.Get = function() {
		return timeStarted ? new Date().getTime() * timescale - startTime : stoppedTime;
	};

	this.StartTime = function() {
		startTime = new Date().getTime() * timescale;
		timeStarted = true;
	};

	this.StopTime = function() {
		stoppedTime = new Date().getTime() * timescale;
		timeStarted = false;
	};

	this.StartTime();
}

module.exports = {
  Time: Time,
  time: new Time()
};
