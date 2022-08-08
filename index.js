const WORK = 25;
const SHORT_BREAK = 5;
const LONG_BREAK = 15;
var TOTAL_BREAKS = 0;
var TOTAL_WORKING = 0;
var REPS = 1;
var timer = {
    state: false,
    sec: 0,
};
const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
};
let date = new Date();
$(".date").text(date.toLocaleDateString("en", options));

function startTimer() {
    if (timer.state === false) {
        timer.state = true;

        if (REPS % 8 === 0) {
            $(".state").text("Break");
            $(".state").css("color", "#FD5D5D");
            count(60 * LONG_BREAK);

        } else if (REPS % 2 === 0) {
            $(".state").text("Break");
            $(".state").css("color", "#FD5D5D");
            count(60 * SHORT_BREAK);

        } else {
            $(".state").text("Work");
            $(".state").css("color", " #4B8673");
            count(60 * WORK);
        }
    }
}

function updateClock() {
    let workMin = Math.floor(TOTAL_WORKING / 60);
    let workSec = Math.floor(TOTAL_WORKING % 60);
    let breakMin = Math.floor(TOTAL_BREAKS / 60);
    let breakSec = Math.floor(TOTAL_BREAKS % 60);

    // if(workMin<10){
    //     workMin="0"+workMin;
    // }

    if (workSec < 10) {
        workSec = "0" + workSec;
    }

    // if(breakMin<10){
    //     breakMin="0"+breakMin;
    // }

    if (breakSec < 10) {
        breakSec = "0" + breakSec;
    }
    $(".work").text("Work: " + workMin + "h  " + workSec + "mins");
    $(".break").text("Breaks: " + breakMin + "h  " + breakSec + "mins");
}

function updateTimer() {
    let countMin = Math.floor(timer.sec / 60);
    let countSec = Math.floor(timer.sec % 60);

    if (countMin < 10) {
        countMin = "0" + countMin;
    }

    if (countSec < 10) {
        countSec = "0" + countSec;
    }

    let timeString = countMin + ":" + countSec;
    $("#timer").text(timeString);
}

function count(num) {
    if (timer.state === true) {
        timer.sec = num;
        updateTimer();
        const interval = setInterval(function () {
            if(timer.state===false){
                clearInterval(interval);
                return;
            }
            
            timer.sec--;
            updateTimer();
            
            if (!timer.sec) {
                clearInterval(interval);
                timer.state = false;
                updateTimer();
                REPS += 1;
                if (REPS > 8 && (REPS - 1) % 8 == 0) {

                    TOTAL_BREAKS += 20;
                    updateClock();

                } else if (REPS > 2 && (REPS - 1) % 2 == 0) {

                    TOTAL_BREAKS += 5;
                    updateClock();

                } else {

                    TOTAL_WORKING += 25;
                    updateClock();
                }
            }
        }, 1000)
    }
}

function pause() {
    if (timer.state === true) {
        $(".start").attr("disabled", false);
        timer.state = false;
    }
}


function reset() {
    timer.state = false;
    timer.sec = 0;
    TOTAL_BREAKS = 0;
    TOTAL_WORKING = 0;
    REPS = 1;
    $(".work").text("Work:");
    $(".break").text("Breaks:");
    $("#timer").text("25:00");
    $(".state").text("Pomodoro");
    $(".state").css("color", "#FD5D5D");
    $(".start").attr("disabled", false);
}

function resume() {
    if (timer.state === false && timer.sec > 0) {
        $(".start").attr("disabled", true);
        timer.state = true;
        count(timer.sec);
    }
}
window.addEventListener("beforeunload", function (e) {
    // Cancel the event
    e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
    // Chrome requires returnValue to be set
    e.returnValue = "";
});

$(".start").click(() => {

    if (timer.sec > 0 && timer.state === false) {
        swal({
            title: "Do you want to restart this interval?",
            icon: "warning",
            buttons: true,
            dangerMode: false,
        }).then((res1) => {
            if (res1) {
                return startTimer();
            }
        });
    }
    else {
        $(".start").attr("disabled", true);
        startTimer();
    }


});
$(".pause").click(pause);
$(".resume").click(resume);

$(".reset").click(() => {
    swal({
        title: "Are you sure?",
        text: "Resetting will delete all your progress, Are you sure you want to continue?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((res) => {
        if (res) {
            reset();
        }
    });
});
