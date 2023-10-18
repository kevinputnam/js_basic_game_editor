function flipCaret(tag){
      tag.parentElement.querySelector(".nested").classList.toggle("active");
      tag.classList.toggle("caret-down");
}

class BuildingBlock {
  static next_id = 0;

  constructor(data) {
    this.id = BuildingBlock.next_id;
    BuildingBlock.next_id += 1;
    this.name = 'undefined node';
    this.description = 'BuildingBlock';
  }

  updateDisplay() {
    this.nodeSpan.innerHTML = '<b>'+ this.name + ':</b> ' + this.description;
  }

  display() { //default display method
    this.node = document.createElement("div");
    this.node.setAttribute("class","treeNode");
    this.nodeSpan = document.createElement("span");
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
    this.node.append(this.nodeSpan);
    return this.node;
  }

  edit(){
    console.log("Edit " + this.name);
  }

  remove(){
    this.node.remove();
  }
}