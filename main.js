var l = localStorage, _ = document;

var editor = {
  create(type, theme) {
    var obj = Object.create(this);
    obj.elm = _.createElement('div');
    this.elm.appendChild(obj.elm);
    obj.elm.classList.add('editor');
    obj.editor = ace.edit(elm);
    obj.editor.getSession().setMode('ace/modes/' + type);
    obj.editor.setTheme('ace/themes/' + theme);
    this.editors.push(obj);
    return obj;
  },
  editors: [],
  elm: _.getElementById('editors')
};
