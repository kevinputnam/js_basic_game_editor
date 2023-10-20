
//prototype for all game objects
class BuildingBlock {

  constructor(data) {
    this.parent = null;
    if (data){
      if (data.parent){
        this.parent = data.parent;
      }
    }
    this.name = 'undefined node';
    this.description = 'BuildingBlock';
    this.node = document.createElement("div");
    this.node.setAttribute("class","treeNode");
    this.nodeSpan = document.createElement("span");
    this.node.append(this.nodeSpan);
    this.moveDownButton = document.createElement('button');
    this.moveDownButton.innerHTML = '<i class="arrow down"></i>'
    this.moveUpButton = document.createElement('button');
    this.moveUpButton.innerHTML = '<i class="arrow up"></i>'
    this.removeButton = document.createElement('button');
    this.removeButton.innerHTML = 'Remove';
    var me = this;
    this.moveDownButton.addEventListener(
      "click",
      function () {
        me.moveDown();
      },
      false,
    );
    this.moveUpButton.addEventListener(
      "click",
      function () {
        me.moveUp();
      },
      false,
    );
    this.removeButton.addEventListener(
      "click",
      function () {
        me.remove();
      },
      false,
    );
  }

  updateDisplay() {
    this.nodeSpan.innerHTML = '<b>'+ this.name + ':</b> ' + this.description;
  }

  display() { //default display method
    this.updateDisplay();
    var me = this;
    this.nodeSpan.addEventListener(
      "click",
      function () {
        var highlighted_divs = document.getElementsByClassName('select-highlight');
        for (const d of highlighted_divs){
          d.classList.remove('select-highlight');
        }
        me.nodeSpan.classList.add('select-highlight');
        me.edit();
      },
      false,
    );
    return this.node;
  }

  edit(){
    console.log("Edit " + this.name);
  }

  remove(){
    this.node.remove();
  }

  moveUp(){
    var parent = this.node.parentElement;
    if (parent.children.length != 1){
      var index = Array.prototype.indexOf.call(parent.children, this.node);
      if (index != 0){
        parent.removeChild(this.node);
        parent.children[index - 1].before(this.display());
      }
    }
  }

  moveDown(){
    var parent = this.node.parentElement;
    if (parent.children.length != 1){
      var index = Array.prototype.indexOf.call(parent.children, this.node);
      if (index != parent.children.length - 1){
        parent.removeChild(this.node);
        parent.children[index].after(this.display());
      }
    }
  }
}