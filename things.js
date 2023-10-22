

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
  }

  remove(){
    super.remove();
    if(this.parent){
      this.parent.things.splice(this.parent.things.indexOf(this.id),1);
    }
    var editView = document.getElementById('editview');
    editView.replaceChildren();
  }

}