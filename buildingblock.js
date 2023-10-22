
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
    this.nodes = [];
    this.currentNode = null;
  }

  updateNodes() {
    for (const node of this.nodes){
      var nodeSpan = node.firstChild;
      this.updateDisplay(nodeSpan);
    }
  }

  updateDisplay(nodespan) {
    nodeSpan.innerHTML = '<b>'+ this.name + ':</b> ' + this.description;
  }

  display(info) { //default display method

    var node = document.createElement("div");
    node.setAttribute("class","treeNode");
    node.classList.add(info);
    var nodeSpan = document.createElement("span");
    node.append(nodeSpan);

    var me = this;
    nodeSpan.addEventListener(
      "click", (event)=> {
        toggleHighlight(nodeSpan);
        me.edit(node);
      });
    this.nodes.push(node);
    this.updateNodes();
    return node;
  }

  edit(node){
    this.currentNode = node;
    console.log(this.currentNode);
  }

  createRemoveButton(){
    var me = this;
    var removeButton = document.createElement('button');
    removeButton.innerHTML = 'Remove';
    removeButton.addEventListener(
      "click",
      function () {
        me.remove();
      },
      false,
    );
    return removeButton;
  }

  createUpAndDownButtons(){
    var me = this;

    var moveDownButton = document.createElement('button');
    moveDownButton.innerHTML = '<i class="arrow down"></i>'
    var moveUpButton = document.createElement('button');
    moveUpButton.innerHTML = '<i class="arrow up"></i>'
    moveDownButton.addEventListener(
      "click",
      function () {
        me.moveDown();
      },
      false,
    );
    moveUpButton.addEventListener(
      "click",
      function () {
        me.moveUp();
      },
      false,
    );

    return [moveUpButton, moveDownButton];
  }

  remove(){
    this.currentNode.remove();
    var i = this.nodes.indexOf(this.currentNode);
    this.nodes.splice(i,1);
  }

  moveUp(){
    var parent = this.currentNode.parentElement;
    if (parent.children.length != 1){
      var index = Array.prototype.indexOf.call(parent.children, this.currentNode);
      if (index != 0){
        parent.removeChild(this.currentNode);
        parent.children[index - 1].before(this.currentNode);
      }
    }
  }

  moveDown(){
    var parent = this.currentNode.parentElement;
    if (parent.children.length != 1){
      var index = Array.prototype.indexOf.call(parent.children, this.currentNode);
      if (index != parent.children.length - 1){
        parent.removeChild(this.currentNode);
        parent.children[index].after(this.currentNode);
      }
    }
  }
}