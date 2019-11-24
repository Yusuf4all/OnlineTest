window.addEventListener('load', init);

function init() {
  document.querySelector('#doRegister').addEventListener('click', doRegister);
  document.querySelector('#Login').addEventListener('click', backLogin);
}

function backLogin() {
  location.href = 'index.html';
}

function doRegister() {
  var email = document.querySelector('#email').value;
  var pwd = document.querySelector('#pwd').value;
  var cpwd = document.querySelector('#cpwd').value;

  if (email != '' && pwd != '' && cpwd != '') {
    if (pwd == cpwd) {
      var result = firebase.auth().createUserWithEmailAndPassword(email, pwd);
      result.then((data) => {
        alert('Register Successfully now login your self....')
    }).catch((err)=> alert(err.message));
    }
    else {
      alert('Password not match');
    }
  }
  else {
    alert('Fill up the field');
  }

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      location.href = 'index.html';
    }
  });
}

