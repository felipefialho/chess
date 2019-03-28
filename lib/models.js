let app = module.parent.exports;

const loadModel = (name) => {
    return require(app.path+'/model/'+name+'.js');
};

app.models = {
    user: loadModel('user'),
    room: loadModel('room')
};