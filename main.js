var l = localStorage, _ = document;

var fs = (function (){
  var obj = {};
  BrowserFS.install(obj);
  var lsfs = new BrowserFS.FileSystem.LocalStorage();
  BrowserFS.initialize(lsfs);
  return obj.require('fs');
});

var editors = {
  create(type, theme) {
    var obj = Object.create(this);
    obj.elm = _.createElement('div');
    this.elm.appendChild(obj.elm);
    obj.elm.classList.add('editor');
    obj.editor = ace.edit(obj.elm);
    obj.editor.getSession().setMode('ace/modes/' + type);
    obj.editor.setTheme('ace/themes/' + theme);
    this.editors.push(obj);
    return obj;
  },
  editors: [],
  elm: _.getElementById('editors')
};

var extToType = {
  'js': 'javascript',
  'md': 'markdown',
  'html': 'html',
  'css': 'css'
};

function add() {
  var fileName = prompt('Filename?');
  var type = extToType(fileName.split('.').pop());
  var editor = editors.create(type);
  return new Promise((resolve, reject) => fs.writeFile(fileName, '', (err, res) => err ? reject(err) : resolve(res)));
}
