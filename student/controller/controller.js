window.addEventListener('load', init);
window.addEventListener('online', () => {
    alert("You are online");
});

window.addEventListener('offline', () => {
    alert('You are offline');
});
var second = 15;
function init() {
    if (index == 0) {
        document.querySelector('#previous').disabled = true;
    }
    document.querySelector('#startTest').disabled = true;
    document.querySelector('#next').addEventListener('click', nextQuestion);
    document.querySelector('#startTest').addEventListener('click', startTest);
    document.querySelector('#previous').addEventListener('click', prevQuestion);
    document.querySelector('#finish').addEventListener('click', finishTest);
    document.querySelector('#logout').addEventListener('click', doLogout);
    getQuestion();

}
function printInfo(quesArr) {
    var totalScore = 0;
    document.querySelector('#uid').innerText = localStorage.userid;
    document.querySelector('#tques').innerText = quesArr.length;
    document.querySelector('#time').innerText = (Math.floor(quesArr.length * second) / 60) + ' Minutes';
    questionOpr.question.forEach(obj => {
        totalScore = totalScore + parseInt(obj.score);
    });
    questionOpr.question.totalScore = totalScore;
    document.querySelector('#marks').innerText = totalScore;
}

function doLogout() {
    dbOperation.logout();
}

function finishTest() {
    index++;
    isChecked();
    var userScore = 0;
    document.querySelectorAll('.change').forEach(ele => ele.className = 'd-none');
    questionOpr.question.forEach(obj => {
        if (obj.rans == obj.yans) {
            userScore = userScore + parseInt(obj.score);
        }
    });
    clearInterval(interval);
    printResult(userScore);
    questionOpr.question.userScore = userScore;
    dbOperation.submitResult(questionOpr.question).then((data) => {
        alert('Thank you!!!');
    }).catch((err) => {
        console.log(err);
    });
}

function printResult(totalScore) {
    document.querySelector('#total').innerText = totalScore;
    document.querySelector('#result').className = 'd-block';
    var tbody = document.querySelector('#comparision');
    for (let obj of questionOpr.question) {
        var tr = tbody.insertRow();
        var index = 0;
        for (let key in obj) {
            if (key == 'rans' || key == 'yans') {
                let td = tr.insertCell(index);
                td.innerText = obj[key];
                if (obj.rans != obj.yans) {
                    var tr = td.parentNode;
                    tr.className = 'bg-danger';
                }
                index++;
            }
            else {
                continue;
            }
        }
    }
}

function startTest() {
    document.querySelector('#userInfo').classList.toggle('d-none');
    document.querySelector('#startTest').classList.toggle('d-none');
    document.querySelector('#previous').classList.toggle('d-block');
    document.querySelector('#option').classList.toggle('d-block');
    document.querySelector('#next').classList.toggle('d-block');
    document.querySelector('#finish').classList.toggle('d-block');
    document.querySelector('#head').classList.toggle('d-block');
    document.querySelector('#count').innerText = index + 1;
    printQuestion(questionOpr.question[index]);
    timeleft = (questionOpr.question.length * second);
    startTime();
}

var count = 0;
var timeleft = 5;
var interval;
function startTime() {
    interval = setInterval(() => {
        count++;
        document.querySelector('#timer').innerText = convertTime(timeleft - count);
        if (timeleft == count) {
            ring();
            clearInterval(interval);
            finishTest();
        }
    }, 1000);

}
function ring() {
    var audio = document.querySelector('#audio');
    audio.src = '/JavaScript/OnlineTest/css/ding.mp3';
    audio.play();
}
function convertTime(seconds) {
    var mint = Math.floor(seconds / 60);
    var sec = seconds % 60;
    return mint + ':' + sec;
}

var index = 0;
function prevQuestion() {
    index--;
    if (index == 0) {
        document.querySelector('#previous').disabled = true;
    }
    document.querySelector('#next').disabled = false;
    document.querySelector('#count').innerText = index + 1;
    printQuestion(questionOpr.question[index]);
    checked();
}

function nextQuestion() {
    index++;
    isChecked();
    if (index + 1 == questionOpr.question.length) {
        document.querySelector('#next').disabled = true;
    }
    document.querySelector('#previous').disabled = false;
    document.querySelector('#count').innerText = index + 1;
    printQuestion(questionOpr.question[index]);
    checked();
}

function isChecked() {
    var radio = document.querySelectorAll('input');
    radio.forEach(ele => {
        if (ele.checked) {
            questionOpr.question[index - 1].yans = ele.value;
        }

    });
}

function checked() {
    if (questionOpr.question[index].yans) {
        var radio = document.querySelectorAll('input');
        radio.forEach(ele => {
            if (ele.value == questionOpr.question[index].yans) {
                ele.checked = true;
            }
        });
    }
}

function getQuestion() {
    var promise = dbOperation.getQuestion();
    promise.then(data => {
        document.querySelector('#startTest').disabled = false;
        questionOpr.question.userid = localStorage.userid;
        printInfo(questionOpr.question);
    }).catch(err => console.log(err));
}

function printQuestion(question) {
    document.querySelector('#option').innerHTML = '';
    var print = document.querySelector('#print');
    var options = document.querySelector('#option');
    for (let key in question) {
        if (key == 'name') {
            print.innerText = question[key].charAt(0).toUpperCase() + question[key].slice(1).toLowerCase();
            continue;
        }
        if (key == 'id' || key == 'rans' || key == 'score' || key == 'isMarked' || key == 'yans') {
            continue;
        }
        var input = document.createElement('input');
        var brk = document.createElement('br');
        var label = document.createElement('label');
        label.innerText = question[key].charAt(0).toUpperCase() + question[key].slice(1).toLowerCase();
        input.type = 'radio';
        input.name = 'option';
        input.value = question[key];
        options.appendChild(input);
        options.appendChild(label);
        options.appendChild(brk);
    }
}