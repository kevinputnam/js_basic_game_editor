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

  display() {
    this.treeNode = document.createElement("div");
    this.treeNode.setAttribute("class","treeNode");
    this.treeNodeSpan = document.createElement("span");
    this.treeNodeSpan.innerHTML = '<b>'+ this.name + ':</b> ' + this.description;
    var me = this;
    this.span.addEventListener(
      "click",
      function () {
        var highlighted_divs = document.getElementsByClassName('select-highlight');
        for (const d of highlighted_divs){
          d.classList.remove('select-highlight');
        }
        me.span.classList.add('select-highlight');
        me.edit();
      },
      false,
    );
    this.node.append(this.span);
    return this.node;
  }

  edit(){
    console.log("Edit " + this.name);
  }
}