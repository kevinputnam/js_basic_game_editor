
class Scene extends GameContainer {
  static next_id = 0;

  constructor(data) {
    super(data);

    this.id = Scene.next_id;
    Scene.next_id += 1;
    this.type = "Scene";

    this.background = "";
    this.map_size = [];
    this.grid_size = null;
    this.collisions = [];
  }

  load(data) {

    super.load(data);

    this.background = data['background'];
    this.map_size = data['map_size'];
    this.grid_size = data['grid_size'];
    this.collisions = data['collisions'];

  }

  save() {
    var data = super.save();
    data['background'] = this.background;
    data['map_size'] = this.map_size;
    data['grid_size'] = this.grid_size;
    data['collisions'] = this.collisions;

    return data;
  }

  edit(node){
    super.edit(node);
    var editView = document.getElementById('editview');
    editView.append(this.createRemoveButton(),document.createElement('br'),document.createElement('br'));
  }

  remove(){
    super.remove();
    if(this.parent){
      this.parent.scenes.splice(this.parent.scenes.indexOf(this.id),1);
    }
    var editView = document.getElementById('editview');
    editView.replaceChildren();
  }
}