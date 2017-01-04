var dayNightTimer = null;
var timeUnit = {
    seconds: 1,
    minutes: 60,
    hours: 3600,
    days: 86400,
    weeks: 604800,
    months: 2628000,
    years: 31556930
};
var minecraftEvent = {
    sunrise: "06:01:00",
    sunset: "18:00:00",
    midnight: "00:00:00",
    midday: "12:00",
    mobsBegin: "19:10",
    mobsEnd: "04:50:00",
    daytimeCheck: function(currentTime) {
        if (currentTime < minecraftEvent.sunset && currentTime > minecraftEvent.sunrise) {
            return true;
        } else {
            return false;
        }
    },
    mobsCheck: function(currentTime) {
        if (currentTime < minecraftEvent.mobsEnd && currentTime > minecraftEvent.mobsBegin) {
            return false;
        } else {
            return true;
        }
    }
};

/**
 * [minecraftTimer - set the minecraftTimer]
 * @type {Timer}
 */
var minecraftTimer = new Timer({ID:"mcTime", name:"Minecraft Time"});
var realTime = new Timer({ID:"realTime", name:"Real Time"});


// OOP CLASS TIMER
/**
 * [Timer - OOP object for setting the Timer Object]
 * @param {[type]} ID   [The ID of the HTML element to be inserted into]
 * @param {[type]} name [The string name given to the Timer]
 */
function Timer(params) {
    this.ID = params.ID;
    this.name = params.name;
  /**
   * [setTime - set the time]
   * @param {[type]} timeSpeed  [description]
   * @param {[type]} timeLimit  [description]
   * @param {[type]} timeInSecs [description]
   */
    function setTime(timeSpeed, timeLimit, timeInSecs) {
        var setUnit = ~~((timeSpeed % timeLimit) / timeInSecs); //Bitwise operation "~~" is used the same way as Math.floor
        var zero = setUnit.toString().length;
        if (zero < 2) { // if less than 10 add a leading 0 i.e '01'
            setUnit = "0" + setUnit;
        }
        return setUnit;
    }

    // methods for seconds, mins and hours for all the timers
    this.secs = function() {
        return setTime(this.setTimeSpeed, timeUnit.minutes, timeUnit.seconds);
    };
    this.mins = function() {
        return setTime(this.setTimeSpeed, timeUnit.hours, timeUnit.minutes);
    };
    this.hrs = function() {
        return setTime(this.setTimeSpeed, timeUnit.days, timeUnit.hours);
    };

    // set the HTML of the page for the timer
    this.formattedOutput = function() {
        return this.hrs() + ":" + this.mins() + ":" + this.secs();
    }
    this.setHTML = function() {
        document.getElementById(this.ID).innerHTML = this.formattedOutput();
    };
    this.reset = function() {
        document.getElementById(this.ID).innerHTML = "00:00:00";
    };
}


function startTimer() {
    var start = new Date().getTime();
    if (dayNightTimer !== null) return;

    dayNightTimer = window.setInterval(function() {
        var time = new Date().getTime() - start;

        //oop version
        minecraftTimer.setTimeSpeed = (Math.floor((time + 300000) / 100) / 10) * 72;
        minecraftTimer.setHTML();
        var currentTime = minecraftTimer.formattedOutput();
        minecraftEvent.mobsCheck(currentTime);


        // Real Time
        realTime.setTimeSpeed = Math.floor(time / 100) / 10;
        realTime.setHTML();

    }, 100);
}

/*------- ## Start of View ## -------*/


/**
 * [beginTimer - function to begin Timers using HTML button]
 * @return {HTML} [returns innerHTML value]
 */
function beginTimer() {
    if (timerBtn.innerHTML == "Sleep") {
        startTimer();
        timerBtn.innerHTML = "Reset";
    } else if (timerBtn.innerHTML == "Reset") {
        resetTimer();
        timerBtn.innerHTML = "Sleep";
    }
}
/**
 * [resetTimer - function to reset all Timers using the same HTML button]
 */
function resetTimer() {
    clearInterval(dayNightTimer);
    minecraftTimer.reset();
    realTime.reset();
    dayNightTimer = null;
}


var timerBtn = document.getElementById("timerBtn");
timerBtn.addEventListener("click", beginTimer, false);
