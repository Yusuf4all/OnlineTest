const dbOperation = {
    add(questions) {
        for (let obj of questions) {
            for (let key in obj) {
                if (key == 'id') {
                    var promise = firebase.database().ref("/Question/" + obj[key]).set(obj);
                }
            }
        }
        return promise;
    },
    logout() {
        firebase.auth().signOut();
    },
    getQuestion() {
        var promise = new Promise((response, reject) => {
            var stream = firebase.database().ref('/Question/');
            stream.on('value', (snapshot) => {
                var question = snapshot.val();           //Question Object
                var obj = Object.keys(question);        //Key of Question(101,102,103,104)
                questionOperation.questions = [];
                for (let i = 0; i < obj.length; i++) {
                    var key = obj[i];                      //i = 101,i = 102,i = 102,i = 102
                    var questionsObject = new Question(question[key].id, question[key].name, question[key].optionA, question[key].optionB, question[key].optionC, question[key].optionD, question[key].rans, question[key].score);
                    questionOperation.questions.push(questionsObject);
                }
                response(questionOperation.questions);
            }, (error) => reject(error));
        });
        return promise;
    }
}
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        location.href = 'index.html';
    }
});
