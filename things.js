

class Thing extends GameContainer {
  static next_id = 0;

  constructor(data) {
    super(data);

    this.id = Thing.next_id;
    Thing.next_id += 1;
    this.type = "Thing";

    this.hidden = false;
    this.trigger = false;
    this.triggered = false;

    this.sprite= null; //TODO define sprite object using building block
    this.location = [0,0];
    this.dimensions = [0,0];

  }

  load(data) {

    super.load(data);

    this.hidden = data['hidden'];
    this.trigger = data['trigger'];
    this.triggered = data['triggered'];

    //TODO add sprite handling this.sprite = ?
    this.location = data['location'];
    this.dimensions = data['dimensions'];
  }

  save() {
    var data = super.save();
    data['hidden'] = this.hidden;
    data['trigger'] = this.trigger;
    data['triggered'] = this.triggered;
    data['location'] = this.location;
    data['dimensions'] = this.dimensions;

    return data;
  }

  edit(node){
    super.edit(node);
    if (!node.classList.contains('game'))
    {
      var editView = document.getElementById('editview');
      editView.append(this.createRemoveButton(),document.createElement('br'),document.createElement('br'));
    }
    console.log(this.parent);
  }

  getParentObjectOfNode(node){
    var parentName = node.parentElement.parentElement.parentElement.getAttribute('name');
    var parentNameBits = parentName.split("_");
    var parentType = parentNameBits[0];
    var parentID = parentNameBits[1];
    var parent = null;
    if (parentType == 'Thing'){
      parent = this.game.things[parentID];
    }else if (parentType == 'Scene'){
      parent = this.game.scenes[parentID];
    }
    return parent;
  }

  remove(){
    var parent = this.getParentObjectOfNode(this.currentNode);

    // find all of the instances that have the same parent node
    for (const node of this.nodes){
      console.log(node);
      if(!node.classList.contains('game')){
        if(parent == this.getParentObjectOfNode(node)){

          //remove the node from the DOM
          node.remove();

          //remove the node from list of nodes this object tracks
          var i = this.nodes.indexOf(node);
          this.nodes.splice(i,1);
        }
      }
    }

    // remove the thing id from its parent's list of things
    if(parent){
      parent.things.splice(parent.things.indexOf(this.id),1);
    }
    this.parent = null;
    var editView = document.getElementById('editview');
    editView.replaceChildren();
  }

}