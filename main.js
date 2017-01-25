var l = localStorage, _ = document;

var fs = (function (){
  var obj = {};
  BrowserFS.install(obj);
  var lsfs = new BrowserFS.FileSystem.LocalStorage();
  BrowserFS.initialize(lsfs);
  return obj.require('fs');
})();

var saving = _.getElementById('saving');

var editors = {
  create(type, theme) {
    var obj = Object.create(this);
    obj.elm = _.createElement('div');
    this.elm.appendChild(obj.elm);
    obj.elm.classList.add('editor');
    obj.editor = ace.edit(obj.elm);
    obj.editor.getSession().setMode('ace/mode/' + type);
    obj.editor.setTheme('ace/theme/' + theme);
    this.editors.push(obj);
    return obj;
  },
  editors: [],
  elm: _.getElementById('editors'),
  editorsByName: Object.create(null)
};

var extToType = {
  'js': 'javascript',
  'md': 'markdown',
  'html': 'html',
  'css': 'css'
};

function add(fileName) {
  var type = extToType[fileName.split('.').pop()];
  var editor = editors.create(type, 'chrome');
  editors.editorsByName[fileName] = editor;
  try {
    editor.editor.setValue(fs.readFileSync(fileName, 'utf-8'));
  } catch (e) {
    console.debug(e);
    fs.writeFileSync(fileName, '');  
  }
}

function save() {
  var ps = [];
  for (var i in editors.editorsByName) {
    ps.push(new Promise((resolve, reject) => fs.writeFile(
      i,
      editors.editorsByName[i].editor.getValue(),
      (err, res) => err ? reject(err) : resolve(res))
    ));
  }
  return Promise.all(ps);
}

function saveWithUI() {
  saving.innerHTML = "Saving...";
  return save().then(() => saving.innerHTML = "All changes saved").catch(err => {
    console.error(err);
    saving.innerHTML = "Error saving: " + err.message
  });
}

function compile() {
  
}

function bundle(main) {
  return rollup.rollup({
    entry: main,
    plugins: [{
      load(id){
        return fs.readFileSync(id, 'utf-8')
      },
      resolveId(importee, importer){
        return importee + '.js';
      }
    }]
  }).then(bundle => bundle.generate({
    format: 'iife',
    moduleName: "mian"
  }), er => {throw er}).then(res => _.getElementById('output').innerHTML = res.code);
}

function del(file) {
  return new Promise((resolve, reject) => fs.unlink(
    file,
    (err, res) => err ? reject(err) : resolve(res)
  ));
}
