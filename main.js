var l = localStorage, _ = document;

var editor = {
  create() {
    var obj = Object.create(this);
    obj.elm = _.createElement('div');
    this.elm.appendChild(obj.elm);
    obj.editor = ace.edit(elm);
    return obj;
  },
  
  elm: _.getElementById('editors');
};
