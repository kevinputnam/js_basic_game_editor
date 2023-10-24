

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
    this.spritePath = "";
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
    this.spritePath = data['spritePath'];
  }

  save() {
    var data = super.save();
    data['hidden'] = this.hidden;
    data['trigger'] = this.trigger;
    data['triggered'] = this.triggered;
    data['location'] = this.location;
    data['dimensions'] = this.dimensions;
    data['spritePath'] = this.spritePath;

    return data;
  }

  getParentCanvasContext(){
    if (this.parent){
      if (this.parent.canvasContext){
        return this.parent.canvasContext;
      }
    }
    return null;
  }

  showSprite(){
    var me = this;
    var canvasContext = this.getParentCanvasContext();
    if (this.spritePath){
      if(canvasContext) {
        if (this.spritePath.length > 0){
          var image = document.createElement('img');
          image.setAttribute('src',this.spritePath);
          image.addEventListener("load", (e) => {
            canvasContext.drawImage(image, me.location[0],me.location[1]);
          });
        }
      }
    }
  }

  edit(node){
    super.edit(node);
    var me = this;
    var editView = document.getElementById('editview');

    var inputLabel = document.createElement("label")
    inputLabel.innerHTML = "Sprite image: ";

    var imageFileInputField = createElementWithAttributes('input',{'type':'text','maxlength':'100','size':'60'});
    imageFileInputField.value = this.spritePath;
    imageFileInputField.addEventListener("change", (event)=> {
      me.spritePath = event.target.value;
      me.updateSprite();
      me.showSprite();
    })

    editView.append(inputLabel,imageFileInputField,document.createElement('br'))

    var inputLabel2 = document.createElement("label")
    inputLabel2.innerHTML = "Location [x,y]: ";

    var xInputField = createElementWithAttributes('input',{'type':'number','min':'0','max':this.game.screenDimensions[0]});
    xInputField.value = this.location[0];
    xInputField.addEventListener("change", (event)=> {
      me.location[0] = event.target.value;
      me.showSprite();
    })

    var yInputField = createElementWithAttributes('input',{'type':'number','min':'0','max':this.game.screenDimensions[1]});
    yInputField.value = this.location[1];
    yInputField.addEventListener("change", (event)=> {
      me.location[1] = event.target.value;
      me.showSprite();
    })

    editView.append(inputLabel2,xInputField,yInputField,document.createElement('br'));

    if (!node.classList.contains('game'))
    {
      var editView = document.getElementById('editview');
      editView.append(this.createRemoveButton(),document.createElement('br'),document.createElement('br'));
    }
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
    // find all of the instances that have the same parent node
    var new_nodes = [];
    for (const node of this.nodes){
      if(!node.classList.contains('game')){
        //remove the node from the DOM
        node.remove();
      }else{
        new_nodes.push(node); //only add the game node to list of nodes;
      }
    }

    this.nodes = new_nodes;
    // remove the thing id from its parent's list of things
    if(this.parent){
      this.parent.things.splice(this.parent.things.indexOf(this.id),1);
    }
    this.parent = null;
    var editView = document.getElementById('editview');
    editView.replaceChildren();
  }

}