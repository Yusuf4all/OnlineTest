window.addEventListener('load', init);
var counter;
function init() {
    updateCount();
    bindEvents();
    counter = autoIncreament();
    autoIncNum();
}

const autoIncNum = () => document.querySelector('#id').innerText = counter.next().value;

function bindEvents() {
    document.querySelector('#add').addEventListener('click', addQuestion);
    document.querySelector('#delete').addEventListener('click', deleteMarked);
    document.querySelector('#save').addEventListener('click', saveData);
    document.querySelector('#load').addEventListener('click', loadData);
    document.querySelector('#sserver').addEventListener('click', saveServer);
    document.querySelector('#fserver').addEventListener('click', fetchServer);
    document.querySelector('#clear').addEventListener('click', clearAll);
    document.querySelector('#search').addEventListener('click', toggleSearch);
    document.querySelector('#fsearch').addEventListener('click', searchData);
    document.querySelector('#sort').addEventListener('click', toggleSort);
    document.querySelector('#fsort').addEventListener('click', sortData);
    document.querySelector('#update').addEventListener('click', updateData);
    document.querySelector('#logout').addEventListener('click', doLogout);
}

function doLogout() {
    dbOperation.logout();
}


function toggleSort() {
    document.querySelector('#searchBox').className = 'd-none';
    document.querySelector('#sortBox').classList.toggle('d-block');
}

function sortData() {
    var mySortSelect = document.querySelector('#mySortSelect').value;
    if (mySortSelect != '') {
        var sortarry = questionOperation.sortData(mySortSelect);
        printTable(sortarry);
    }
}


function searchData() {
    var mySearchSelect = document.querySelector('#mySearchSelect').value;
    var searchData = document.querySelector('#searchData').value;
    if ((searchData && mySearchSelect) != '') {
        var searchArry = questionOperation.searchData(mySearchSelect, searchData);
        updateCount();
        printTable(searchArry);
    }
    else {
        alert('Please select or enter data for search');
    }
}

function toggleSearch() {
    var questions = questionOperation.questions;
    document.querySelector('#sortBox').className = 'd-none';
    document.querySelector('#searchBox').classList.toggle('d-block');
    printTable(questions);
}


function fetchServer() {
    var promise = dbOperation.getQuestion();
    promise.then(data => {
        printTable(data);
    }).catch(error => {
        console.log(error);
    });
}
function saveServer() {
    let promise = dbOperation.add(questionOperation.questions);
    promise.then(data => {
        alert('Data save on server!!!!');
    }).catch(error => {
        console.log('Error:- ', error);
        alert('Error!!!!');
    });
}


function addQuestion() {
    var questionObject = new Question();
    for (let key in questionObject) {
        if (key == 'isMarked') {
            continue;
        }
        if (key == 'id') {
            questionObject[key] = document.querySelector('#' + key).innerText;
            continue;
        }
        questionObject[key] = document.querySelector('#' + key).value;
    }
    questionOperation.add(questionObject);
    // console.log(questionObject);
    printQuestion(questionObject);
    updateCount();
    autoIncNum();
    clearAll();
}

function deleteMarked() {
    var array = questionOperation.delete();
    printTable(array);
}

function printTable(arr) {
    document.querySelector("#printQuestion").innerHTML = '';
    arr.forEach(printQuestion);
    updateCount();
}

function printQuestion(questionObject) {
    var tbody = document.querySelector("#printQuestion");
    var tr = tbody.insertRow();
    var index = 0;
    for (let key in questionObject) {
        if (key == 'isMarked') {
            continue;
        }
        let td = tr.insertCell(index);
        td.innerText = questionObject[key];
        index++;
    }
    let td = tr.insertCell(index);
    let id = questionObject.id;
    td.appendChild(createIcon('https://cdn4.iconfinder.com/data/icons/email-2-2/32/Trash-Email-Bin-512.png', toggleMark, id));
    td.appendChild(createIcon('https://cdn3.iconfinder.com/data/icons/block/32/box_edit-512.png', edit, id));

}

function createIcon(path, fn, id) {
    var img = document.createElement('img');
    img.src = path;
    img.className = 'size';
    img.setAttribute('qid', id);
    img.addEventListener('click', fn);  // Image Click here
    return img;
}

var updateQuestion;
function edit() {
    let id = this.getAttribute('qid');
    updateQuestion = questionOperation.search(id);
    editData(updateQuestion);
}

function editData(question) {
    for (let key in question) {
        if (key == 'id') {
            document.querySelector('#' + key).innerText = question[key];
            continue;
        }
        if (key == 'isMarked') {
            continue;
        }
        document.querySelector('#' + key).value = question[key];
        document.querySelector('#add').disabled = true;
        document.querySelector('#name').focus();
    }
}

function updateData() {
    for (let key in updateQuestion) {
        if (key == 'id' || key == 'isMarked') {
            continue;
        }

        updateQuestion[key] = document.querySelector("#" + key).value;
    }
    printTable(questionOperation.questions);
    alert('Updated Successfully...');
    clearAll();
    autoIncNum();
    document.querySelector('#add').disabled = false;
}

function toggleMark() {
    var id = this.getAttribute('qid');
    questionOperation.toggleMark(id);
    var tr = this.parentNode.parentNode;
    tr.classList.toggle('alert-secondary');
    updateCount();
}

function updateCount() {
    document.querySelector('#total').innerText = questionOperation.questions.length;
    document.querySelector('#selected').innerText = questionOperation.countMark();
    if (questionOperation.countMark() == 0) {
        document.querySelector("#delete").disabled = true;
    }
    else {
        document.querySelector('#delete').disabled = false;
    }
    document.querySelector('#unselected').innerText = questionOperation.questions.length - questionOperation.countMark();
}

function saveData() {
    if (localStorage) {
        var json = JSON.stringify(questionOperation.questions);
        // console.log(json);
        localStorage.questions = json;
        alert('Data save successfully');
    }
    else {
        alert('Your browser is outdated please update your browser...');
    }
}

function loadData() {
    if (localStorage) {
        if (localStorage.questions) {
            questionOperation.questions = []; // quetion 
            let arryofObjects = JSON.parse(localStorage.questions);
            for (let obj of arryofObjects) {
                let questionsObject = new Question(obj.id, obj.name, obj.optionA, obj.optionB, obj.optionC, obj.optionD, obj.rans, obj.score);
                questionOperation.questions.push(questionsObject);
            }
            printTable(questionOperation.questions);
        }
        else {
            alert('Nothing to load');
        }
    }
    else {
        alert('Your browser is outdated please update your browser...');
    }
}
function clearAll() {
    document.querySelectorAll('.clear').forEach(array => array.value = '');
    document.querySelector('#name').focus();
    updateCount();
}