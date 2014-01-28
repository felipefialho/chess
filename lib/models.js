var app = module.parent.exports;

var loadModel = function(name) {
    return require(app.path+'/model/'+name+'.js');
};

app.models = {
    user: loadModel('user'),
    room: loadModel('room')
};