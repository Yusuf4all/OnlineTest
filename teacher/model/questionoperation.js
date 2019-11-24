var questionOperation = {
    questions: [],
    add(questionObject) {
        this.questions.push(questionObject);
    },
    sortData(type) {
        if(type == 'id') {
            return  this.questions.sort((a,b) => a.id - b.id);
        }
        if (type == 'score') {
            return this.questions.sort((a, b) => a.score - b.score);
        }
        if(type == 'name') {
            return this.questions.sort((a,b) => a.name.localeCompare(b.name));
        }
    },
    searchData(type, data) {
        if (type == 'id') {
            data = this.questions.filter(obj => obj.id == data);
            if (data == '') {
                alert('Not Found');
                return this.questions;
            }
            else {
                return data;
            }
        }
        if (type == 'name') {
            data = this.questions.filter(obj => obj.name == data);
            if (data == '') {
                alert('Not Found');
                return this.questions;
            }
            else {
                return data;
            }
        }
        if (type == 'score') {
            data = this.questions.filter(obj => obj.score == data);
            if (data == '') {
                alert('Not Found');
                return this.questions;
            }
            else {
                return data;
            }
        }
    },
    search(id) {
        return this.questions.find(questionObject => questionObject.id == id);
    },
    toggleMark(id) {
        this.search(id).toggle();
    },
    countMark() {
        return this.questions.filter(questionObject => questionObject.isMarked).length;
    },
    delete() {
        return this.questions = this.questions.filter(questionObject => questionObject.isMarked == false);
    }
};

