window.addEventListener('load', init);
function init() {
    document.querySelector('#register').addEventListener('click', backRegister);
    document.querySelector('#doLogin').addEventListener('click', doLogin);
    document.querySelector('#fpass').addEventListener('click', backForget);
}
function backForget() {
    location.href = 'forgot.html';
}

function backRegister() {
    location.href = 'registration.html';
}

function doLogin() {
    var email = document.querySelector('#email').value;
    var pwd = document.querySelector('#pwd').value;
   
    if (email != "" && pwd != "") {
        var result = firebase.auth().signInWithEmailAndPassword(email, pwd);
        result.then((data) => {
            localStorage.userid = email;
        }).catch((err) => {
            window.alert('Invalid Password or email');
        });
    }
    firebase.auth().onAuthStateChanged((user) => {
        if (user.email == 'admin@gmail.com') {
            location.href = 'teacher.html';
        }
        else {
            location.href = 'student.html';
        }
    });
}
