function* autoIncreament(){
    var num = 100;
    while(true) {
        num++;
        yield num;
    }
}