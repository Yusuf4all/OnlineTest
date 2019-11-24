window.addEventListener('load', init);
function init() {
    document.querySelector('#forgot').addEventListener('click',forgot);
  
}

function forgot() {
    var email = document.querySelector('#email').value;
    var promise = firebase.auth().sendPasswordResetEmail(email);
        promise.then((data)=>{
        alert('Email has been send to you, Please check and verify.');
        location.href= 'index.html';
    }).catch((err)=>{
        alert('Enter valid email address..');
    });
      firebase.auth().onAuthStateChanged((user)=>{
        if(user){
            location.href = 'student.html';
        }
    });
}